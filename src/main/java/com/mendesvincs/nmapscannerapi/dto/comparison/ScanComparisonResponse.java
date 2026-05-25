package com.mendesvincs.nmapscannerapi.dto.comparison;

import com.mendesvincs.nmapscannerapi.model.HostResult;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ScanComparisonResponse {

    private String target;
    private LocalDateTime baseScanDate;
    private LocalDateTime newScanDate;

    private ScanComparisonSummary summary = new ScanComparisonSummary();

    private List<HostResult> newHosts = new ArrayList<>();
    private List<HostResult> removedHosts = new ArrayList<>();
    private List<HostDifference> hostDifferences = new ArrayList<>();

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public LocalDateTime getBaseScanDate() {
        return baseScanDate;
    }

    public void setBaseScanDate(LocalDateTime baseScanDate) {
        this.baseScanDate = baseScanDate;
    }

    public LocalDateTime getNewScanDate() {
        return newScanDate;
    }

    public void setNewScanDate(LocalDateTime newScanDate) {
        this.newScanDate = newScanDate;
    }

    public ScanComparisonSummary getSummary() {
        return summary;
    }

    public void setSummary(ScanComparisonSummary summary) {
        this.summary = summary;
    }

    public List<HostResult> getNewHosts() {
        return newHosts;
    }

    public void setNewHosts(List<HostResult> newHosts) {
        this.newHosts = newHosts;
    }

    public List<HostResult> getRemovedHosts() {
        return removedHosts;
    }

    public void setRemovedHosts(List<HostResult> removedHosts) {
        this.removedHosts = removedHosts;
    }

    public List<HostDifference> getHostDifferences() {
        return hostDifferences;
    }

    public void setHostDifferences(List<HostDifference> hostDifferences) {
        this.hostDifferences = hostDifferences;
    }
}