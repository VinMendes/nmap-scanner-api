package com.mendesvincs.nmapscannerapi.model;

public class PortResult {

    /*
     * Representa uma porta encontrada em um host durante a varredura do Nmap.
     *
     * Uma porta é um ponto de comunicação usado por serviços de rede.
     * Por exemplo:
     * - porta 80: geralmente usada para HTTP;
     * - porta 443: geralmente usada para HTTPS;
     * - porta 22: geralmente usada para SSH.
     *
     * Essa classe guarda:
     * - o número da porta;
     * - o protocolo usado, como TCP ou UDP;
     * - o estado da porta, como "open" ou "closed";
     * - o serviço identificado;
     * - o produto e a versão, quando o Nmap conseguir identificar.
     */

    private Integer port;
    private String protocol;
    private String state;
    private String service;
    private String product;
    private String version;

    /*
     * Construtor vazio.
     *
     * Esse construtor é útil em projetos Spring, porque o framework
     * pode precisar criar objetos automaticamente ao converter JSON
     * em objetos Java ou objetos Java em JSON.
     */
    public PortResult() {
    }

    /*
     * Construtor da classe PortResult.
     *
     * Recebe as informações de uma porta encontrada pelo Nmap.
     *
     * Os campos product e version podem vir vazios, pois nem sempre
     * o Nmap consegue identificar o produto ou a versão do serviço.
     */
    public PortResult(
            Integer port,
            String protocol,
            String state,
            String service,
            String product,
            String version
    ) {
        this.port = port;
        this.protocol = protocol;
        this.state = state;
        this.service = service;
        this.product = product;
        this.version = version;
    }

    /*
     * Retorna uma representação em texto da porta.
     *
     * Esse método é usado quando queremos imprimir a porta
     * de forma mais legível no terminal.
     */
    @Override
    public String toString() {
        return "Porta: " + this.port + "/" + this.protocol
                + " | Estado: " + this.state
                + " | Serviço: " + this.service
                + " | Produto: " + this.product
                + " | Versão: " + this.version;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}