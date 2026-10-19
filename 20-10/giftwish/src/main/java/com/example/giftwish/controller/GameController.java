package com.example.giftwish.controller;

import com.example.giftwish.dto.SpinResponse;
import com.example.giftwish.reward.FlowerReward;
import com.example.giftwish.reward.GiftBoxReward;
import com.example.giftwish.reward.Reward;
import com.example.giftwish.service.GameService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    /** GET /api/game/spin: quay thưởng ngẫu nhiên. */
    @GetMapping("/spin")
    public SpinResponse spinReward() {
        Reward reward = gameService.spin();
        String type = (reward instanceof FlowerReward) ? "FLOWER"
                : (reward instanceof GiftBoxReward) ? "GIFTBOX" : "MONEY";
        return new SpinResponse(type, reward.getMessage());
    }
}
