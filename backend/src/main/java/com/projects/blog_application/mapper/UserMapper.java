package com.projects.blog_application.mapper;

import com.projects.blog_application.domain.dtos.RegisterRequestDTO;
import com.projects.blog_application.domain.dtos.RegisterResponseDTO;
import com.projects.blog_application.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    User toEntity(RegisterRequestDTO registerRequestDTO);

    RegisterResponseDTO toDto(User user);

}
