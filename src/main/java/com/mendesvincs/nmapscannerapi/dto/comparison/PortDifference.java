package com.mendesvincs.nmapscannerapi.dto.comparison;

import com.mendesvincs.nmapscannerapi.model.PortResult;

public class PortDifference {

    private int port;
    private String protocol;

    private PortResult before;
    private PortResult after;

    public PortDifference() {
    }

    public PortDifference(int port, String protocol, PortResult before, PortResult after) {
        this.port = port;
        this.protocol = protocol;
        this.before = before;
        this.after = after;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public PortResult getBefore() {
        return before;
    }

    public void setBefore(PortResult before) {
        this.before = before;
    }

    public PortResult getAfter() {
        return after;
    }

    public void setAfter(PortResult after) {
        this.after = after;
    }
}