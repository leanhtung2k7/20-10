package com.example.giftwish.dto;

import com.example.giftwish.model.Wish;

/** effect: HEART | FLOWER | GAME. redirect khác null khi frontend cần chuyển trang (GAME). */
public record WishResponse(Wish wish, String effect, String redirect) {
}
