package com.example.giftwish.repository;

import com.example.giftwish.exception.FileStorageException;
import com.example.giftwish.model.Wish;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/** Lưu danh sách Wish xuống file bằng ObjectOutputStream. */
@Repository
public class FileWishRepository implements WishRepository {

    private final Path filePath;

    public FileWishRepository(
            @Value("${app.wish.storage-path:data/wishes.dat}") String storagePath) {
        this.filePath = Path.of(storagePath);
    }

    @Override
    public synchronized void save(Wish wish) {
        List<Wish> wishes = findAll();
        wishes.add(wish);
        writeAll(wishes);
    }

    @Override
    @SuppressWarnings("unchecked")
    public synchronized List<Wish> findAll() {
        if (!Files.exists(filePath)) {
            return new ArrayList<>();
        }
        try (ObjectInputStream in = new ObjectInputStream(Files.newInputStream(filePath))) {
            return new ArrayList<>((List<Wish>) in.readObject());
        } catch (IOException | ClassNotFoundException e) {
            throw new FileStorageException("Không thể đọc file lời chúc: " + filePath, e);
        }
    }

    private void writeAll(List<Wish> wishes) {
        try {
            Path parent = filePath.toAbsolutePath().getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }
            try (ObjectOutputStream out =
                         new ObjectOutputStream(Files.newOutputStream(filePath))) {
                out.writeObject(new ArrayList<>(wishes));
            }
        } catch (IOException e) {
            throw new FileStorageException("Không thể ghi file lời chúc: " + filePath, e);
        }
    }
}
