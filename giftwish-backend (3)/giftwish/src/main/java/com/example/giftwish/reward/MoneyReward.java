package com.example.giftwish.reward;

public class MoneyReward implements Reward {

    private final long amount;

    public MoneyReward(long amount) {
        this.amount = amount;
    }

    @Override
    public String getMessage() {
        return "Bạn nhận được lì xì " + amount + " VNĐ 🧧";
    }
}
