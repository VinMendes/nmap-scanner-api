package com.mendesvincs.nmapscannerapi.model;

import java.util.ArrayList;
import java.util.List;

public class HostResult {

    /*
     * Representa um host encontrado em uma varredura do Nmap.
     *
     * Um host é um dispositivo da rede, como um computador, servidor,
     * roteador, impressora ou a própria máquina local.
     *
     * Essa classe guarda:
     * - o endereço IP do host;
     * - o status do host, por exemplo "up";
     * - a lista de portas encontradas nesse host.
     */

    private String ip;
    private String status;
    private List<PortResult> ports;

    /*
     * Construtor vazio.
     *
     * Esse construtor é importante em projetos Spring, principalmente
     * quando o framework precisa criar objetos automaticamente ao lidar
     * com JSON, requisições HTTP ou banco de dados.
     */
    public HostResult() {
        this.ports = new ArrayList<>();
    }

    /*
     * Construtor da classe HostResult.
     *
     * Recebe o IP e o status do host encontrado pelo Nmap.
     * Também inicializa uma lista vazia de portas, pois as portas
     * serão adicionadas depois, conforme forem encontradas na varredura.
     */
    public HostResult(String ip, String status) {
        this.ip = ip;
        this.status = status;
        this.ports = new ArrayList<>();
    }

    /*
     * Adiciona uma porta encontrada ao host.
     *
     * O parâmetro portResult deve ser um objeto da classe PortResult,
     * que contém informações como número da porta, estado e serviço.
     */
    public void addPort(PortResult portResult) {
        this.ports.add(portResult);
    }

    /*
     * Retorna uma representação em texto do host.
     *
     * Esse método é usado quando queremos imprimir o objeto de forma
     * mais legível no terminal.
     */
    @Override
    public String toString() {
        StringBuilder text = new StringBuilder();

        text.append("Host: ")
                .append(this.ip)
                .append(" | Status: ")
                .append(this.status)
                .append("\n");

        for (PortResult port : this.ports) {
            text.append("  - ")
                    .append(port)
                    .append("\n");
        }

        return text.toString();
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<PortResult> getPorts() {
        return ports;
    }

    public void setPorts(List<PortResult> ports) {
        this.ports = ports;
    }
}