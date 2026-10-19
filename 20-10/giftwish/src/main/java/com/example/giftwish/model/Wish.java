package com.example.giftwish.model;

import com.example.giftwish.exception.ValidationException;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/** Lời chúc. Implements Serializable để lưu bằng ObjectOutputStream. */
public class Wish implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String senderName;
    private String content;
    private LocalDateTime createdAt;

    public Wish() {
        this.createdAt = LocalDateTime.now();
    }

    public Wish(String senderName, String content) {
        this.senderName = senderName;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }

    /** Kiểm tra tính hợp lệ, ném {@link ValidationException} nếu sai. */
    public void validate() {
        if (senderName == null || senderName.isBlank()) {
            throw new ValidationException("Tên người gửi không được để trống");
        }
        if (content == null || content.isBlank()) {
            throw new ValidationException("Nội dung lời chúc không được để trống");
        }
    }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
