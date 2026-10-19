package com.example.giftwish.model;

public class Flower extends Gift {

    public Flower(String name) {
        super(name);
    }

    @Override
    public String getDescription() {
        return "Bó hoa: " + name;
    }

    @Override
    public String deliver() {
        return "Đang gửi bó hoa \"" + name + "\" đến người nhận 🌸";
    }
}
