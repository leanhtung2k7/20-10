package com.example.giftwish.effect;

import com.example.giftwish.exception.FileStorageException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Đọc map từ khóa -> loại từ effect-keywords.properties và phân loại lời nhắn:
 * GAME (chuyển sang game.html) > HEART > mặc định FLOWER.
 * So khớp không phân biệt hoa thường và dấu tiếng Việt.
 */
@Component
public class KeywordDetector {

    public static final String GAME = "GAME";
    public static final String HEART = "HEART";
    public static final String FLOWER = "FLOWER";

    private static final String KEYWORD_FILE = "effect-keywords.properties";

    private final Map<String, String> keywordMap = new ConcurrentHashMap<>();

    public KeywordDetector() {
        Properties props = new Properties();
        try (Reader reader = new InputStreamReader(
                new ClassPathResource(KEYWORD_FILE).getInputStream(), StandardCharsets.UTF_8)) {
            props.load(reader);
        } catch (IOException e) {
            throw new FileStorageException("Không thể đọc file từ khóa: " + KEYWORD_FILE, e);
        }
        props.forEach((k, v) -> keywordMap.put(
                normalize(k.toString()), v.toString().trim().toUpperCase(Locale.ROOT)));
    }

    /** Luôn trả về GAME, HEART hoặc FLOWER (mặc định). */
    public String detect(String content) {
        if (content == null || content.isBlank()) {
            return FLOWER;
        }
        String text = normalize(content);
        boolean heart = false;
        for (Map.Entry<String, String> e : keywordMap.entrySet()) {
            if (text.contains(e.getKey())) {
                if (GAME.equals(e.getValue())) {
                    return GAME;
                }
                if (HEART.equals(e.getValue())) {
                    heart = true;
                }
            }
        }
        return heart ? HEART : FLOWER;
    }

    public Map<String, String> getKeywordMap() {
        return Map.copyOf(keywordMap);
    }

    private static String normalize(String s) {
        return Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .replace('đ', 'd').replace('Đ', 'D')
                .toLowerCase(Locale.ROOT).trim();
    }
}
