package com.example.giftwish.exception;

/** Ném ra khi dữ liệu đầu vào (ví dụ Wish) không hợp lệ. */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
