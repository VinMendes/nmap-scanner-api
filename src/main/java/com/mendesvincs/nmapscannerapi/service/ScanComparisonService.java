package com.mendesvincs.nmapscannerapi.service;

import com.mendesvincs.nmapscannerapi.comparison.ScanComparator;
import com.mendesvincs.nmapscannerapi.dto.comparison.ScanComparisonResponse;
import com.mendesvincs.nmapscannerapi.model.ScanResult;
import org.springframework.stereotype.Service;

@Service
public class ScanComparisonService {

    private final ScanComparator scanComparator;

    public ScanComparisonService(ScanComparator scanComparator) {
        this.scanComparator = scanComparator;
    }

    public ScanComparisonResponse compare(ScanResult baseScan, ScanResult newScan) {
        return scanComparator.compare(baseScan, newScan);
    }
}