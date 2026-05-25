package com.mendesvincs.nmapscannerapi.comparison.dto;

import com.mendesvincs.nmapscannerapi.scan.model.PortResult;

import java.util.ArrayList;
import java.util.List;

public class HostDifference {

    private String ip;
    private String statusBefore;
    private String statusAfter;

    private List<PortResult> openedPorts = new ArrayList<>();
    private List<PortResult> closedPorts = new ArrayList<>();
    private List<PortDifference> changedPorts = new ArrayList<>();

    public boolean hasDifferences() {
        return statusChanged()
                || !openedPorts.isEmpty()
                || !closedPorts.isEmpty()
                || !changedPorts.isEmpty();
    }

    private boolean statusChanged() {
        if (statusBefore == null && statusAfter == null) {
            return false;
        }

        if (statusBefore == null || statusAfter == null) {
            return true;
        }

        return !statusBefore.equals(statusAfter);
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getStatusBefore() {
        return statusBefore;
    }

    public void setStatusBefore(String statusBefore) {
        this.statusBefore = statusBefore;
    }

    public String getStatusAfter() {
        return statusAfter;
    }

    public void setStatusAfter(String statusAfter) {
        this.statusAfter = statusAfter;
    }

    public List<PortResult> getOpenedPorts() {
        return openedPorts;
    }

    public void setOpenedPorts(List<PortResult> openedPorts) {
        this.openedPorts = openedPorts;
    }

    public List<PortResult> getClosedPorts() {
        return closedPorts;
    }

    public void setClosedPorts(List<PortResult> closedPorts) {
        this.closedPorts = closedPorts;
    }

    public List<PortDifference> getChangedPorts() {
        return changedPorts;
    }

    public void setChangedPorts(List<PortDifference> changedPorts) {
        this.changedPorts = changedPorts;
    }
}