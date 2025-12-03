package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.PostStatus;
import com.projects.blog_application.domain.dtos.CreatePostDTO;
import com.projects.blog_application.domain.dtos.PostUpdateDTO;
import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.Tag;
import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.exception.NotAllowedOperationException;
import com.projects.blog_application.exception.ResourceNotFoundException;
import com.projects.blog_application.repositories.PostRepository;
import com.projects.blog_application.service.CategoryService;
import com.projects.blog_application.service.PostService;
import com.projects.blog_application.service.TagService;
import com.projects.blog_application.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;
    private final UserService userService;
    private final static int WORD_PER_MINUTE = 200;


    //service method for get all post
    @Override
    @Transactional
    public List<Post> getAllPosts(UUID categoryId, UUID tagId) {

        if (categoryId != null && tagId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            Tag tag = tagService.getTagById(tagId);

            return postRepository.findAllByPostStatusAndCategoryAndTagsContaining(PostStatus.PUBLISHED, category, tag);
        }

        if (categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            return postRepository.findAllByPostStatusAndCategory(PostStatus.PUBLISHED, category);
        }

        if (tagId != null) {
            Tag tag = tagService.getTagById(tagId);
            return postRepository.findAllByPostStatusAndTagsContaining(PostStatus.PUBLISHED, tag);
        }

        return postRepository.findAllByPostStatus(PostStatus.PUBLISHED);
    }

    //service method for get drafts post only
    @Override
    public List<Post> getDrafts(UUID userId) {
        User loggedInUser = userService.getUserById(userId);
        return postRepository.findAllByAuthorAndPostStatus(loggedInUser, PostStatus.DRAFT);
    }


    //service method for create a post
    @Override
    @Transactional
    public Post createPost(CreatePostDTO createPostDTO, UUID userId) {

        User loggedInUser = userService.getUserById(userId);
        List<Tag> tags = tagService.getTagIds(createPostDTO.getTagIds());
        Category category = categoryService.getCategoryById(createPostDTO.getCategoryId());

        Post post = Post.builder()
                .title(createPostDTO.getTitle())
                .content(createPostDTO.getContent())
                .tags(new HashSet<>(tags))
                .category(category)
                .postStatus(createPostDTO.getStatus())
                .author(loggedInUser)
                .readingTime(calculateReadTime(createPostDTO.getContent()))
                .build();

        return postRepository.save(post);
    }


    //a utility method which calculate read time
    private int calculateReadTime(String content) {
        int wordCount = content.trim().split("\\s").length;
        return (int) Math.ceil((double) wordCount / WORD_PER_MINUTE);
    }


    //service method for update a post
    @Override
    @Transactional
    public Post updatePost(UUID id, PostUpdateDTO postUpdateDTO, UUID userId) {

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
        if (!existingTagIds.equals(updatePostRequestTagIds)) {
            List<Tag> newTags = tagService.getTagIds(updatePostRequestTagIds);
            existingPost.setTags(new HashSet<>(newTags));
        }

        return postRepository.save(existingPost);
    }

    //service method for get post by id
    @Override
    public Post getPost(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post does not exist with ID " + id));
    }


    //service method for delete a post
    @Override
    public void deletePost(UUID postId,UUID userId) {

        if (!getPost(postId).getAuthor().getId().equals(userId)) {
            throw new NotAllowedOperationException("You do not have permission to delete this post.");
        }
        Post post = getPost(postId);
        postRepository.delete(post);
    }


    //service method for get all post of a user
    @Override
    public List<Post> getAllPostByUserId(UUID userid) {
        User author = userService.getUserById(userid);
        return postRepository.findAllByAuthor(author);
    }

}
