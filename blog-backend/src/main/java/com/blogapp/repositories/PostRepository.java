package com.blogapp.repositories;

import com.blogapp.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    boolean existsByTitle(String title);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.createdAt >= :startDate")
    long countPostsFromLastMonth(@Param("startDate")LocalDateTime startDate);

    Optional<Post> findBySlug(String slug);

    @Modifying
    @Query("UPDATE Post p set p.category = null WHERE p.category.id = :categoryId")
    void setCategoryToNull(@Param("categoryId") Long categoryId);

    @Query("SELECT p FROM Post p WHERE p.category.name = :categoryName")
    Page<Post> findByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Post> findByTitleOrContentContainingIgnoreCase(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.category.name = :categoryName AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Post> findByCategoryNameAndTitleOrContentContainingIgnoreCase(
            @Param("categoryName") String categoryName,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

}
