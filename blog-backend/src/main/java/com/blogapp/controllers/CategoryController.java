package com.blogapp.controllers;

import com.blogapp.dto.CategoryDTO;
import com.blogapp.dto.CategoryList;
import com.blogapp.dto.CategoryResponse;
import com.blogapp.dto.CommonResponse;
import com.blogapp.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody @Valid CategoryDTO categoryDTO
    ){
        CategoryDTO category = categoryService.createCategory(categoryDTO);

        CategoryResponse response = new CategoryResponse();

        response.setSuccess(true);
        response.setMessage("Category created successfully.");
        response.setCategory(category);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<CategoryResponse> getOneCategory(
            @PathVariable("id") Long id
    ){
        CategoryDTO categoryDTO = categoryService.getCategory(id);
        CategoryResponse response = new CategoryResponse();

        response.setSuccess(true);
        response.setMessage("Get category successfully");
        response.setCategory(categoryDTO);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<CategoryList> getAllCategory(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ){
        CategoryList response = categoryService.getAllCategories(pageNo, pageSize, sortBy, sortDir);

        response.setSuccess(true);
        response.setMessage("Get Categories successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> deleteCategory(
            @PathVariable("id") Long id
    ){
        CommonResponse response = new CommonResponse();

        response.setMessage(categoryService.deleteCategory(id));
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable("id") Long id,
            @RequestBody @Valid CategoryDTO categoryDTO
    ){
        CategoryDTO categoryResp = categoryService.updateCategory(id, categoryDTO);

        CategoryResponse response = new CategoryResponse();

        response.setSuccess(true);
        response.setMessage("Category Update successfully");
        response.setCategory(categoryResp);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
