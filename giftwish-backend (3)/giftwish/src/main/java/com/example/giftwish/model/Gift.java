package com.example.giftwish.model;

/** Lớp trừu tượng đại diện cho một món quà. */
public abstract class Gift {

    protected String name;

    protected Gift(String name) {
        this.name = name;
    }

    public String getDescription() {
        return "Quà tặng: " + name;
    }

    /** Mỗi loại quà có cách trao tặng riêng. */
    public abstract String deliver();
}
