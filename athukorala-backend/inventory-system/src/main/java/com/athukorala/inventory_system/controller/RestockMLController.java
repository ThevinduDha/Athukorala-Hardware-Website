package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.service.RestockMLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/ml")
@CrossOrigin(origins = "*") // allow frontend access
public class RestockMLController {

    @Autowired
    private RestockMLService mlService;

    @GetMapping("/restock-plan")
    public String getRestockPlan() {
        return mlService.generateRestockPlan();
    }
}