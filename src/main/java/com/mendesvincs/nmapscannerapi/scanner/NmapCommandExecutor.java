package com.mendesvincs.nmapscannerapi.scanner;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
public class NmapCommandExecutor {

    /*
     * Executa o comando Nmap no sistema operacional e retorna
     * a saída XML gerada pelo comando.
     *
     * Essa classe não interpreta o XML.
     * Ela só executa o processo e captura o resultado bruto.
     */
    public String execute(String target) {
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

            return output.toString();

        } catch (Exception exception) {
            throw new RuntimeException("Erro durante a execução do Nmap: " + exception.getMessage(), exception);
        }
    }
}