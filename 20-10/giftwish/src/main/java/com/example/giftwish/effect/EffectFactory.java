package com.example.giftwish.effect;

import com.example.giftwish.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class EffectFactory {

    public Effect create(String type) {
        if (type == null) {
            throw new ValidationException("Loại hiệu ứng không được null");
        }
        return switch (type.toUpperCase(Locale.ROOT)) {
            case "HEART" -> new HeartEffect();
            case "FLOWER" -> new FlowerEffect();
            default -> throw new ValidationException("Loại hiệu ứng không hỗ trợ: " + type);
        };
    }
}
