package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.PostStatus;
import com.projects.blog_application.domain.dtos.CreatePostDTO;
import com.projects.blog_application.domain.dtos.PageResponse;
import com.projects.blog_application.domain.dtos.PostUpdateDTO;
import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.Tag;
import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.exception.CommentsAvailableException;
import com.projects.blog_application.exception.NotAllowedOperationException;
import com.projects.blog_application.exception.ResourceNotFoundException;
import com.projects.blog_application.mapper.PostMapper;
import com.projects.blog_application.repositories.CommentRepository;
import com.projects.blog_application.repositories.PostRepository;
import com.projects.blog_application.service.*;
import com.projects.blog_application.util.CursorDecoder;
import com.projects.blog_application.util.CursorEncoder;
import lombok.RequiredArgsConstructor;
import lombok.Value;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;
    private final UserService userService;
    private final PostMapper postMapper;
    private final static int WORD_PER_MINUTE = 200;
    private final CommentService commentService;
    private final FileService fileService;

    // service method for get all post
    @Override
    @Transactional
    @Cacheable("posts")
    public PageResponse getAllPosts(int pageSize, String cursor, UUID categoryId) {

        pageSize = Math.min(pageSize, 20);
        Pageable pageable = PageRequest.of(0, pageSize + 1);

        List<Post> posts;
        if (cursor == null && categoryId == null) {

            posts = postRepository
                    .findByPostStatusOrderByCreatedAtDesc(pageable, PostStatus.PUBLISHED);

        } else if (cursor == null) {

            posts = postRepository
                    .findByPostStatusAndCategoryIdOrderByCreatedAtDesc(
                            PostStatus.PUBLISHED,
                            categoryId,
                            pageable);

        } else {

            LocalDateTime decodedCursor = CursorDecoder.cursorDecoder(cursor);

            if (categoryId == null) {
                posts = postRepository
                        .findByPostStatusAndCreatedAtLessThanOrderByCreatedAtDesc(
                                PostStatus.PUBLISHED,
                                decodedCursor,
                                pageable);
            } else {
                posts = postRepository
                        .findByPostStatusAndCategoryIdAndCreatedAtLessThanOrderByCreatedAtDesc(
                                PostStatus.PUBLISHED,
                                categoryId,
                                decodedCursor,
                                pageable);
            }
        }

        boolean hasMore = posts.size() > pageSize;

        if (hasMore) {
            posts = posts.subList(0, pageSize);
        }

        if (posts.isEmpty()) {
            return new PageResponse(
                    Collections.emptyList(),
                    null,
                    false);
        }

        String nextCursor = hasMore
                ? CursorEncoder.encodeCursor(posts.getLast().getCreatedAt())
                : null;

        return new PageResponse(
                posts.stream()
                        .map(postMapper::toDto)
                        .collect(Collectors.toList()),
                nextCursor,
                hasMore);
    }

    // service method for get drafts post only
    @Override
    public List<Post> getDrafts(UUID userId) {
        User loggedInUser = userService.getUserById(userId);
        return postRepository.findAllByAuthorAndPostStatus(loggedInUser, PostStatus.DRAFT);
    }

    // service method for create a post
    @Override
    @Transactional
    @Caching(put = @CachePut(value = "posts_ids", key = "#result.id"), evict = @CacheEvict(value = "posts", allEntries = true))
    public Post createPost(CreatePostDTO createPostDTO, UUID userId, MultipartFile file) {

        User loggedInUser = userService.getUserById(userId);
        List<Tag> tags = new ArrayList<>();
        if (createPostDTO.getTagIds() != null && !createPostDTO.getTagIds().isEmpty()) {
            tags = tagService.getTagIds(createPostDTO.getTagIds());
        }
        Category category = categoryService.getCategoryById(createPostDTO.getCategoryId());

        String coverImageUrl = null;
        if (file != null) {
            coverImageUrl = fileService.saveImage(file);
        }

        Post post = Post.builder()
                .title(createPostDTO.getTitle())
                .content(createPostDTO.getContent())
                .tags(new HashSet<>(tags))
                .category(category)
                .postStatus(createPostDTO.getStatus())
                .author(loggedInUser)
                .readingTime(calculateReadTime(createPostDTO.getContent()))
                .coverImageUrl(coverImageUrl)
                .build();

        return postRepository.save(post);
    }

    // a utility method which calculate read time
    private int calculateReadTime(String content) {
        int wordCount = content.trim().split("\\s").length;
        return (int) Math.ceil((double) wordCount / WORD_PER_MINUTE);
    }

    // service method for update a post
    @Override
    @Transactional
    @Caching(put = @CachePut(value = "posts_ids", key = "#result.id"), evict = @CacheEvict(value = "posts", allEntries = true))
    public Post updatePost(UUID id, PostUpdateDTO postUpdateDTO, UUID userId, MultipartFile file,
            Boolean removeCoverImage) {

        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post does not exist with id " + id));

        if (!existingPost.getAuthor().getId().equals(userId)) {
            throw new NotAllowedOperationException("You do not have permission to update this post.");

        }

        existingPost.setTitle(postUpdateDTO.getTitle());
        String postContent = postUpdateDTO.getContent();
        existingPost.setContent(postContent);
        existingPost.setPostStatus(postUpdateDTO.getStatus());
        existingPost.setReadingTime(calculateReadTime(postContent));

        UUID updatePostRequestCategoryId = postUpdateDTO.getCategoryId();
        if (!existingPost.getCategory().getId().equals(updatePostRequestCategoryId)) {
            Category newCategory = categoryService.getCategoryById(updatePostRequestCategoryId);
            existingPost.setCategory(newCategory);
        }

        Set<UUID> existingTagIds = existingPost.getTags().stream().map(Tag::getId).collect(Collectors.toSet());
        Set<UUID> updatePostRequestTagIds = postUpdateDTO.getTagIds();
        if (updatePostRequestTagIds != null && !existingTagIds.equals(updatePostRequestTagIds)) {
            List<Tag> newTags = tagService.getTagIds(updatePostRequestTagIds);
            existingPost.setTags(new HashSet<>(newTags));
        }

        if (Boolean.TRUE.equals(removeCoverImage)) {
            if (existingPost.getCoverImageUrl() != null) {
                fileService.deleteImage(existingPost.getId());
                existingPost.setCoverImageUrl(null);
            }
        } else if (file != null && !file.isEmpty()) {
            // If a new file is uploaded
            if (existingPost.getCoverImageUrl() != null) {
                fileService.deleteImage(existingPost.getId());
            }
            String coverImageUrl = fileService.saveImage(file);
            existingPost.setCoverImageUrl(coverImageUrl);
        }

        return postRepository.save(existingPost);
    }

    // service method for get post by id
    @Cacheable("posts_ids")
    @Override
    public Post getPost(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post does not exist with ID " + id));
    }

    // service method for delete a post
    @Caching(evict = {
            @CacheEvict(value = "posts", allEntries = true),
            @CacheEvict(value = "posts_ids", key = "#postId")
    })
    @Override
    public void deletePost(UUID postId, UUID userId) {
        Post post = getPost(postId);
        if (!post.getAuthor().getId().equals(userId)) {
            throw new NotAllowedOperationException("You do not have permission to delete this post.");
        }

        if (!commentService.getCommentsByPost(postId).isEmpty()) {
            throw new CommentsAvailableException("post can't be deleted because it contains comment.");
        }
        postRepository.delete(post);
    }

    // service method for get all post of a user
    @Override
    public List<Post> getAllPostByUserId(UUID userid) {
        User author = userService.getUserById(userid);
        return postRepository.findAllByAuthor(author);
    }

    // service method for return featured post
    @Cacheable("featured_post")
    @Override
    public List<Post> getFeaturedPost() {
        return postRepository.findTop5ByIsFeaturedTrueAndPostStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED);
    }

    // service method which return trending posts
    @Cacheable("trending_post")
    @Override
    public List<Post> getTrendingPosts() {
        List<Post> trendingPosts = postRepository
                .findTByIsTrendingTrueAndPostStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED);
        Collections.shuffle(trendingPosts);
        return trendingPosts.stream().limit(5).toList();
    }

}
