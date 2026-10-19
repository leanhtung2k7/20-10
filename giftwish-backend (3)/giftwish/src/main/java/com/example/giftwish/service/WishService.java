package com.example.giftwish.service;

import com.example.giftwish.exception.ValidationException;
import com.example.giftwish.model.Wish;
import com.example.giftwish.repository.WishRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishService {

    public static final int MAX_WORDS = 100;

    private final WishRepository wishRepository;

    public WishService(WishRepository wishRepository) {
        this.wishRepository = wishRepository;
    }

    /** Validate (tên, nội dung, tối đa 100 từ) rồi lưu. Vi phạm sẽ ném ValidationException. */
    public Wish addWish(Wish wish) {
        wish.validate();
        int words = countWords(wish.getContent());
        if (words > MAX_WORDS) {
            throw new ValidationException(
                    "Lời chúc tối đa " + MAX_WORDS + " từ (hiện có " + words + " từ)");
        }
        wishRepository.save(wish);
        return wish;
    }

    /** Mỗi phần tử gồm senderName, content, createdAt. */
    public List<Wish> getWishes() {
        return wishRepository.findAll();
    }

    static int countWords(String text) {
        String t = text == null ? "" : text.trim();
        return t.isEmpty() ? 0 : t.split("\\s+").length;
    }
}
