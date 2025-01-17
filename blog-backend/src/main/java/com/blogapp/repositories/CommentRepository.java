package com.blogapp.repositories;

import com.blogapp.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,Long> {

    List<Comment> findByPostId(Long postId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.createdAt >= :startDate")
    long countCommentsFromLastMonth(@Param("startDate") LocalDateTime startDate);

    @Modifying
    @Query("UPDATE Comment c SET c.user = null WHERE c.user.id = :userId")
    void setUserToNull(@Param("userId") Long userId);

}
