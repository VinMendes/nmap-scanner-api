package com.mendesvincs.nmapscannerapi.comparison.dto;

import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;

public class ScanComparisonRequest {

    private String baseScanId;
    private String newScanId;
    private ScanResult baseScan;
    private ScanResult newScan;

    public String getBaseScanId() {
        return baseScanId;
    }

    public void setBaseScanId(String baseScanId) {
        this.baseScanId = baseScanId;
    }

    public String getNewScanId() {
        return newScanId;
    }

    public void setNewScanId(String newScanId) {
        this.newScanId = newScanId;
    }

    public ScanResult getBaseScan() {
        return baseScan;
    }

    public void setBaseScan(ScanResult baseScan) {
        this.baseScan = baseScan;
    }

    public ScanResult getNewScan() {
        return newScan;
    }

    public void setNewScan(ScanResult newScan) {
        this.newScan = newScan;
    }
}