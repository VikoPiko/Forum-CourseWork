package com.mse.edu.forum.mapper;

import com.mse.edu.forum.api.generated.model.CreateReplyRequest;
import com.mse.edu.forum.api.generated.model.ReplyResponse;
import com.mse.edu.forum.domain.PostEntity;
import com.mse.edu.forum.domain.ReplyEntity;
import com.mse.edu.forum.domain.UserEntity;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ReplyMapper {

    @Mapping(target = "postId", source = "post.id")
    @Mapping(target = "createdByUserId", source = "createdBy.id")
    @Mapping(target = "createdByUsername", source = "createdBy.username")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToOffset")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "instantToOffset")
    ReplyResponse toResponse(ReplyEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "post", source = "post")
    @Mapping(target = "text", source = "request.content", qualifiedByName = "trimmed")
    @Mapping(target = "createdBy", source = "currentUser")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ReplyEntity toEntity(CreateReplyRequest request, PostEntity post, UserEntity currentUser);

    @Named("trimmed")
    default String trimmed(String value) {
        return value == null ? null : value.trim();
    }

    @Named("instantToOffset")
    default OffsetDateTime instantToOffset(Instant instant) {
        return instant == null ? null : instant.atOffset(ZoneOffset.UTC);
    }
}
