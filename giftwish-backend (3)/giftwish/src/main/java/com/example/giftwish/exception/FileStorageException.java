package com.example.giftwish.exception;

/** Ném ra khi đọc/ghi file lưu trữ thất bại. */
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
