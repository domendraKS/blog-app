package com.blogapp.repositories;

import com.blogapp.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT COUNT(c) FROM Category c WHERE c.createdAt >= :startDate")
    long countCategoryFromLastMonth(@Param("startDate") LocalDateTime startDate);
}
