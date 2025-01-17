package com.blogapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryList {

    private List<CategoryDTO> categories;

    private int pageNo;

    private int pageSize;

    private int totalPages;

    private boolean isLast;

    private int totalCategories;

    private long lastMonthCategory;

    private boolean success;

    private String message;

}
