package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.PostStatus;
import com.projects.blog_application.domain.dtos.CreatePostDTO;
import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.Tag;
import com.projects.blog_application.domain.entities.User;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;
    private final UserService userService;
    private final static int WORD_PER_MINUTE=200;



    @Override
    @Transactional
    public List<Post> getAllPosts(UUID categoryId,UUID tagId) {

        if (categoryId!=null && tagId!=null) {
            Category category=categoryService.getCategoryById(categoryId);
            Tag tag=tagService.getTagById(tagId);

            return postRepository.findAllByPostStatusAndCategoryAndTagsContaining(PostStatus.PUBLISHED,category,tag);
        }

        if (categoryId!=null) {
            Category category=categoryService.getCategoryById(categoryId);
            return postRepository.findAllByPostStatusAndCategory(PostStatus.PUBLISHED,category);
        }

        if (tagId!=null) {
            Tag tag=tagService.getTagById(tagId);
            return postRepository.findAllByPostStatusAndTagsContaining(PostStatus.PUBLISHED,tag);
        }

        return postRepository.findAllByPostStatus(PostStatus.PUBLISHED);
    }

    @Override
    public List<Post> getDrafts(UUID userId) {
        User loggedInUser=userService.getUserById(userId);
        return postRepository.findAllByAuthorAndPostStatus(loggedInUser,PostStatus.DRAFT);
    }

//
//    @Override
//    public Post getPostById(UUID id) {
//        return postRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
//    }
//

    @Override
    @Transactional
    public Post createPost(CreatePostDTO createPostDTO,UUID userId) {

        User loggedInUser=userService.getUserById(userId);
        List<Tag> tags=tagService.getTagIds(createPostDTO.getTagIds());
        Category category=categoryService.getCategoryById(createPostDTO.getCategoryId());

        Post post = Post.builder()
                .title(createPostDTO.getTitle())
                .content(createPostDTO.getContent())
                .tags(new HashSet<>(tags))
                .category(category)
                .postStatus(createPostDTO.getStatus())
                .author(loggedInUser)
                .readTime(calculateReadTime(createPostDTO.getContent()))
                .build();

        return postRepository.save(post);
    }


    private int calculateReadTime(String content){
        int wordCount=content.trim().split("\\s").length;
        return (int) Math.ceil((double)wordCount/WORD_PER_MINUTE);
    }

//
//    @Override
//    public Post updatePost(UUID id, PostRequestDTO postRequestDTO) {
//        Post existingPost = getPostById(id);
//
//        if (StringUtils.hasText(postRequestDTO.getTitle())) {
//            existingPost.setTitle(postRequestDTO.getTitle());
//        }
//
//        if (StringUtils.hasText(postRequestDTO.getContent())) {
//            existingPost.setContent(postRequestDTO.getContent());
//        }
//
//        if (postRequestDTO.getTags() != null) {
//            existingPost.setTags(postRequestDTO.getTags());
//        }
//
//        return postRepository.save(existingPost);
//    }
//
//    @Override
//    public void deletePost(UUID id) {
//        Post post = getPostById(id);
//        postRepository.delete(post);
//    }
}
