package com.mendesvincs.nmapscannerapi.dto.comparison;

import com.mendesvincs.nmapscannerapi.model.ScanResult;

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