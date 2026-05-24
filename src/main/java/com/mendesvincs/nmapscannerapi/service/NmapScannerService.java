package com.mendesvincs.nmapscannerapi.service;

import com.mendesvincs.nmapscannerapi.model.ScanResult;
import com.mendesvincs.nmapscannerapi.service.parse.NmapXmlParser;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class NmapScannerService {

    private final NmapXmlParser nmapXmlParser;

    public NmapScannerService(NmapXmlParser nmapXmlParser) {
        this.nmapXmlParser = nmapXmlParser;
    }

    public ScanResult scan(String target) {

        long startTime = System.currentTimeMillis();

        try {
            List<String> command = new ArrayList<>();

            command.add("nmap");
            command.add("-sV");
            command.add("-sC");
            command.add("-oX");
            command.add("-");
            command.add(target);

            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            StringBuilder output = new StringBuilder();

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            )) {
                String line;

                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Erro ao executar o Nmap. Código de saída: " + exitCode);
            }

            ScanResult scanResult = nmapXmlParser.parse(target, output.toString());

            long elapsedTime = System.currentTimeMillis() - startTime;

            return scanResult;

        } catch (Exception exception) {
            throw new RuntimeException("Erro durante a varredura com Nmap: " + exception.getMessage(), exception);
        }
    }
}