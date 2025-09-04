package com.lab.BackEnd.dto.response;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    // Default constructor
    public ApiResponse() {}

    // Constructor without data
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Constructor with data
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Factory method for success response with data
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    // Factory method for success response without data
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message);
    }

    // Factory method for error response
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message);
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
