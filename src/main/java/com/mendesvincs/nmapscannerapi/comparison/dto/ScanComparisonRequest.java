package com.mendesvincs.nmapscannerapi.comparison.dto;

import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;

public class ScanComparisonRequest {

    private ScanResult baseScan;
    private ScanResult newScan;

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