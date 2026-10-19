package com.example.giftwish.repository;

import com.example.giftwish.model.Wish;

import java.util.List;

public interface WishRepository {

    void save(Wish wish);

    List<Wish> findAll();
}
