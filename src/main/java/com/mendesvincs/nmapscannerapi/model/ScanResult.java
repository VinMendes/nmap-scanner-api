package com.mendesvincs.nmapscannerapi.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ScanResult {

    /*
     * Representa o resultado completo de uma varredura do Nmap.
     *
     * Essa classe guarda:
     * - o alvo que foi analisado, como localhost, um IP ou uma rede;
     * - a data e hora em que a varredura foi realizada;
     * - a lista de hosts encontrados durante o scan.
     *
     * Ela funciona como o objeto principal do resultado da varredura.
     * Dentro dela ficam os hosts, e dentro de cada host ficam as portas.
     */

    private String target;
    private LocalDateTime scanDate;
    private List<HostResult> hosts;

    /*
     * Construtor vazio.
     *
     * Esse construtor é importante para o Spring conseguir criar objetos
     * automaticamente quando estiver lidando com JSON ou banco de dados.
     */
    public ScanResult() {
        this.scanDate = LocalDateTime.now();
        this.hosts = new ArrayList<>();
    }

    /*
     * Construtor da classe ScanResult.
     *
     * Recebe o alvo da varredura e registra automaticamente
     * a data e hora em que o scan foi criado.
     *
     * Também inicializa uma lista vazia de hosts, pois os hosts
     * serão adicionados depois, conforme forem encontrados pelo Nmap.
     */
    public ScanResult(String target) {
        this.target = target;
        this.scanDate = LocalDateTime.now();
        this.hosts = new ArrayList<>();
    }

    /*
     * Adiciona um host encontrado ao resultado da varredura.
     *
     * O parâmetro hostResult deve ser um objeto da classe HostResult,
     * que contém informações como IP, status e portas encontradas.
     */
    public void addHost(HostResult hostResult) {
        this.hosts.add(hostResult);
    }

    /*
     * Retorna uma representação em texto do resultado da varredura.
     *
     * Esse método é usado quando queremos imprimir o scan completo
     * de forma mais legível no terminal.
     */
    @Override
    public String toString() {
        StringBuilder text = new StringBuilder();

        text.append("Alvo: ")
                .append(this.target)
                .append("\n");

        text.append("Data do scan: ")
                .append(this.scanDate)
                .append("\n\n");

        for (HostResult host : this.hosts) {
            text.append(host)
                    .append("\n");
        }

        return text.toString();
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public LocalDateTime getScanDate() {
        return scanDate;
    }

    public void setScanDate(LocalDateTime scanDate) {
        this.scanDate = scanDate;
    }

    public List<HostResult> getHosts() {
        return hosts;
    }

    public void setHosts(List<HostResult> hosts) {
        this.hosts = hosts;
    }
}