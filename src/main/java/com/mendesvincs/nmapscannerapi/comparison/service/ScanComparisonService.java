package com.mendesvincs.nmapscannerapi.comparison.service;

import com.mendesvincs.nmapscannerapi.comparison.comparator.ScanComparator;
import com.mendesvincs.nmapscannerapi.comparison.dto.ScanComparisonResponse;
import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;
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