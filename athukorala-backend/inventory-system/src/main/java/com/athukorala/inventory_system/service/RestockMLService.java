package com.athukorala.inventory_system.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class RestockMLService {

    public String generateRestockPlan() {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "py", "-3.11", "ml/predict.py"
            );

            pb.redirectErrorStream(true);

            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();

            System.out.println("PYTHON OUTPUT: " + output.toString());
            System.out.println("EXIT CODE: " + exitCode);

            return output.toString();

        } catch (Exception e) {
            e.printStackTrace(); // 👈 also important
            return "ERROR: " + e.getMessage();
        }
    }
}