package com.example.giftwish.service;

import com.example.giftwish.reward.FlowerReward;
import com.example.giftwish.reward.GiftBoxReward;
import com.example.giftwish.reward.MoneyReward;
import com.example.giftwish.reward.Reward;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Quản lý phần thưởng kèm trọng số. Trọng số cấu hình trong application.properties
 * (app.game.weight.flower / money / giftbox); không cần cộng đúng 100, tỉ lệ = weight / tổng.
 */
@Service
public class GameService {

    private record WeightedReward(Reward reward, int weight) {}

    private final List<WeightedReward> table;
    private final int totalWeight;

    public GameService(@Value("${app.game.weight.flower:50}") int flowerWeight,
                       @Value("${app.game.weight.money:20}") int moneyWeight,
                       @Value("${app.game.weight.giftbox:30}") int giftBoxWeight,
                       @Value("${app.game.money-amount:20000}") long moneyAmount) {
        this.table = List.of(
                new WeightedReward(new FlowerReward(), flowerWeight),
                new WeightedReward(new MoneyReward(moneyAmount), moneyWeight),
                new WeightedReward(new GiftBoxReward(), giftBoxWeight));
        if (table.stream().anyMatch(e -> e.weight() < 0)) {
            throw new IllegalStateException("Trọng số phần thưởng không được âm");
        }
        this.totalWeight = table.stream().mapToInt(WeightedReward::weight).sum();
        if (totalWeight <= 0) {
            throw new IllegalStateException("Tổng trọng số phần thưởng phải lớn hơn 0");
        }
    }

    public List<Reward> getRewards() {
        return table.stream().map(WeightedReward::reward).toList();
    }

    /** Weighted random selection: chọn số ngẫu nhiên trong [0, tổng) rồi duyệt cộng dồn trọng số. */
    public Reward spin() {
        int roll = ThreadLocalRandom.current().nextInt(totalWeight);
        int cumulative = 0;
        for (WeightedReward entry : table) {
            cumulative += entry.weight();
            if (roll < cumulative) {
                return entry.reward();
            }
        }
        return table.get(table.size() - 1).reward(); // không bao giờ xảy ra
    }
}
