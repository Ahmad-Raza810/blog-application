package com.projects.blog_application.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;

import java.time.Duration;

public class CaffeineCacheConfig {

    @Bean
    public CacheManager cacheManager(){
        CaffeineCacheManager cacheManager=new CaffeineCacheManager();
        cacheManager.setCaffeine(caffeine());
        return cacheManager;
    }

    private Caffeine<Object,Object>  caffeine(){
        return Caffeine.newBuilder()
                .initialCapacity(100)
                .maximumSize(500)
                .expireAfterWrite(Duration.ofMinutes(30));
    }
}
