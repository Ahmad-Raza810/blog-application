package com.projects.blog_application.service.Impl;

import com.projects.blog_application.controllers.PostController;
import com.projects.blog_application.domain.PostStatus;
import com.projects.blog_application.domain.dtos.PostRequestDTO;
import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.Tag;
import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.repositories.CategoryRepository;
import com.projects.blog_application.repositories.PostRepository;
import com.projects.blog_application.service.CategoryService;
import com.projects.blog_application.service.PostService;
import com.projects.blog_application.service.TagService;
import com.projects.blog_application.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
    @Transactional(readOnly = true)
    public List<Post> getAllPosts(UUID categoryId,UUID tagId) {


        if (categoryId!=null && tagId!=null) {
            Category category=categoryService.getCategoryById(categoryId);
            Tag tag=tagService.getTagById(tagId);

            return postRepository.findAllByPostStatusAndCategoryAndTagsContaining(PostStatus.PUBLISHED,category,tag);
        }

        else if (categoryId!=null) {
            Category category=categoryService.getCategoryById(categoryId);
            return postRepository.findAllByPostStatusAndCategory(PostStatus.PUBLISHED,category);
        }

        else if (tagId!=null) {
            Tag tag=tagService.getTagById(tagId);
            return postRepository.findAllByPostStatusAndTagsContaining(PostStatus.PUBLISHED,tag);
        }
        else {
            // ✅ Use the fetch-join query for complete data loading
            return postRepository.findAllWithRelations(PostStatus.PUBLISHED);
        }

    }

    @Override
    public List<Post> getDrafts(UUID id) {
        User loggedInUser=userService.getUserById(id);
        return postRepository.findAllByAuthorAndPostStatus(loggedInUser,PostStatus.DRAFT);
    }


    @Override
    public Post createPost(PostRequestDTO postRequestDTO,UUID id) {

        User loggedInUser=userService.getUserById(id);
        List<Tag> relatedTag=tagService.getAllTagsByIds(postRequestDTO.getTagIds());

        Category category=categoryService.getCategoryById(postRequestDTO.getCategoryId());
        Post post = Post.builder()
                .title(postRequestDTO.getTitle())
                .content(postRequestDTO.getContent())
                .readTime(calculateReadTime(postRequestDTO.getContent()))
                .tags(new HashSet<>(relatedTag))
                .postStatus(PostStatus.PUBLISHED)
                .author(loggedInUser)
                .category(category)
                .build();

        return postRepository.save(post);
    }


    private Integer calculateReadTime(String content){
        int wordcount=content.trim().split("\\s").length;
        return (int) Math.ceil(((double)wordcount/WORD_PER_MINUTE));
    }

//
//    @Override
//    public Post getPostById(UUID id) {
//        return postRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
//    }
//

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
