package com.example.giftwish.controller;

import com.example.giftwish.dto.WishRequest;
import com.example.giftwish.dto.WishResponse;
import com.example.giftwish.effect.EffectFactory;
import com.example.giftwish.effect.KeywordDetector;
import com.example.giftwish.model.Wish;
import com.example.giftwish.service.WishService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/wishes")
public class MainController {

    private final WishService wishService;
    private final KeywordDetector keywordDetector;
    private final EffectFactory effectFactory;

    public MainController(WishService wishService,
                          KeywordDetector keywordDetector,
                          EffectFactory effectFactory) {
        this.wishService = wishService;
        this.keywordDetector = keywordDetector;
        this.effectFactory = effectFactory;
    }

    /**
     * "Chơi game" -> không lưu, yêu cầu chuyển sang game.html.
     * Ngược lại lưu lời chúc và trả hiệu ứng: HEART nếu có từ khóa, mặc định FLOWER.
     */
    @PostMapping
    public ResponseEntity<WishResponse> submitWish(@RequestBody WishRequest request) {
        String type = keywordDetector.detect(request.content());
        if (KeywordDetector.GAME.equals(type)) {
            return ResponseEntity.ok(new WishResponse(null, type, "game.html"));
        }
        Wish saved = wishService.addWish(new Wish(request.senderName(), request.content()));
        String effect = effectFactory.create(type).show();
        return ResponseEntity.status(HttpStatus.CREATED).body(new WishResponse(saved, effect, null));
    }

    @GetMapping
    public List<Wish> getWishes() {
        return wishService.getWishes();
    }
}
