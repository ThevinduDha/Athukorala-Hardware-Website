package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Notice;
import com.athukorala.inventory_system.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List; // ADDED THIS IMPORT
import java.util.stream.Collectors; // ADDED THIS IMPORT

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {

    private final NoticeRepository noticeRepository;

    // Fixed "Field injection is not recommended" by using Constructor Injection
    @Autowired
    public NoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @PostMapping("/staff")
    public Notice postStaffNotice(@RequestBody Notice notice) {
        notice.setTargetRole("STAFF"); // Ensures it's internal only [cite: 956]
        notice.setCreatedAt(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    @GetMapping("/staff")
    public List<Notice> getStaffNotices() {
        // Retrieves notices specifically targeted for STAFF [cite: 956]
        return noticeRepository.findAll().stream()
                .filter(n -> "STAFF".equals(n.getTargetRole()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }
}