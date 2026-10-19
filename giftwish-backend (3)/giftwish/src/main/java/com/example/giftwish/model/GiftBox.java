package com.example.giftwish.model;

public class GiftBox extends Gift {

    public GiftBox(String name) {
        super(name);
    }

    @Override
    public String getDescription() {
        return "Hộp quà: " + name;
    }

    @Override
    public String deliver() {
        return "Đang gói và gửi hộp quà \"" + name + "\" đến người nhận 🎁";
    }
}
