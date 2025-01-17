package com.blogapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserList {
    private List<UserDTO> users;

    private int pageNo;

    private int pageSize;

    private int totalPages;

    private boolean isLast;

    private int totalUsers;

    private long lastMonthUsers;

    private boolean success;

    private String message;
}
