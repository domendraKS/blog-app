package com.blogapp.services;

import com.blogapp.dto.CategoryDTO;
import com.blogapp.dto.CategoryList;

public interface CategoryService {
    CategoryDTO createCategory(CategoryDTO categoryDTO);

    CategoryDTO getCategory(Long id);

    CategoryList getAllCategories(int pageNo, int pageSize, String sortBy, String sortDir);

    String deleteCategory(Long id);

    CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO);
}
