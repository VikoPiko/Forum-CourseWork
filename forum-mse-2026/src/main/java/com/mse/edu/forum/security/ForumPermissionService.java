package com.mse.edu.forum.security;

import com.mse.edu.forum.domain.UserRole;
import org.springframework.stereotype.Service;

@Service
public class ForumPermissionService {
    public boolean canEditResource(Long ownerId, long userId, UserRole userRole){
        if(userRole == UserRole.ADMIN || userRole == UserRole.MODERATOR){
            return true;
        }
        return ownerId != null && ownerId.equals(userId); // if ownerId not null and matches with userId -> can edit own post
    }
}
