package com.blogapp.services.impl;

import com.blogapp.dto.CategoryDTO;
import com.blogapp.dto.CategoryList;
import com.blogapp.entities.Category;
import com.blogapp.exception.BlogAPIException;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.repositories.CategoryRepository;
import com.blogapp.repositories.PostRepository;
import com.blogapp.services.CategoryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private CategoryRepository categoryRepository;

    private PostRepository postRepository;

    @Autowired
    public CategoryServiceImpl(
            CategoryRepository categoryRepository,
            PostRepository postRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.postRepository = postRepository;
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new BlogAPIException(HttpStatus.CONFLICT, "Category is already exists.");
        }

        Category newCategory = new Category();

        newCategory.setName(categoryDTO.getName());

        Category savedCategory = categoryRepository.save(newCategory);

        return mapToDTO(savedCategory);
    }

    @Override
    public CategoryDTO getCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found", HttpStatus.NOT_FOUND));

        return mapToDTO(category);
    }

    @Override
    public CategoryList getAllCategories(int pageNo, int pageSize, String sortBy, String sortDir) {
        if (categoryRepository.count() == 0) {
            throw new BlogAPIException(HttpStatus.NOT_FOUND, "No posts are available.");
        }

        Sort sort;
        if(sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())){
            sort = Sort.by(sortBy).ascending();
        }else{
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Category> categoryWithPage = categoryRepository.findAll(pageable);

        List<Category> categories = categoryWithPage.getContent();

        List<CategoryDTO> categoryDTOS = categories.stream()
                .map(category -> mapToDTO(category))
                .collect(Collectors.toList());

        long lastMonthCategory = categoryRepository.countCategoryFromLastMonth(LocalDateTime.now().minusMonths(1));

        CategoryList response = new CategoryList();

        response.setCategories(categoryDTOS);
        response.setLast(categoryWithPage.isLast());
        response.setTotalCategories(categoryDTOS.size());
        response.setTotalPages(categoryWithPage.getTotalPages());
        response.setPageNo(categoryWithPage.getNumber());
        response.setLastMonthCategory(lastMonthCategory);

        return response;
    }

    @Transactional
    @Override
    public String deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found to delete", HttpStatus.NOT_FOUND));

        postRepository.setCategoryToNull(id);

        categoryRepository.delete(category);

        return "Category deleted successfully";
    }

    @Override
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Category Not Found", HttpStatus.NOT_FOUND));

        if(categoryDTO.getName() != null && !categoryDTO.getName().isBlank() && category.getName().equals(categoryDTO.getName())){
            return mapToDTO(category);
        }

        if(categoryRepository.existsByName(categoryDTO.getName())){
            throw new BlogAPIException(HttpStatus.CONFLICT, "Category name is already exists");
        }

        if(categoryDTO.getName() != null && !categoryDTO.getName().isBlank()){
            category.setName(categoryDTO.getName());
        }

        Category updatedCategory = categoryRepository.save(category);

        return mapToDTO(updatedCategory);
    }

    private CategoryDTO mapToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();

        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());

        return dto;
    }
}
