package com.mendesvincs.nmapscannerapi.dto.comparison;

public class ScanComparisonSummary {

    private int newHosts;
    private int removedHosts;
    private int changedHosts;
    private int openedPorts;
    private int closedPorts;
    private int changedPorts;

    public int getNewHosts() {
        return newHosts;
    }

    public void setNewHosts(int newHosts) {
        this.newHosts = newHosts;
    }

    public int getRemovedHosts() {
        return removedHosts;
    }

    public void setRemovedHosts(int removedHosts) {
        this.removedHosts = removedHosts;
    }

    public int getChangedHosts() {
        return changedHosts;
    }

    public void setChangedHosts(int changedHosts) {
        this.changedHosts = changedHosts;
    }

    public int getOpenedPorts() {
        return openedPorts;
    }

    public void setOpenedPorts(int openedPorts) {
        this.openedPorts = openedPorts;
    }

    public int getClosedPorts() {
        return closedPorts;
    }

    public void setClosedPorts(int closedPorts) {
        this.closedPorts = closedPorts;
    }

    public int getChangedPorts() {
        return changedPorts;
    }

    public void setChangedPorts(int changedPorts) {
        this.changedPorts = changedPorts;
    }
}