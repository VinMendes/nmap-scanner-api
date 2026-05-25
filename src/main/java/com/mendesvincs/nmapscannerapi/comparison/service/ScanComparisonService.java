package com.mendesvincs.nmapscannerapi.comparison.service;

import com.mendesvincs.nmapscannerapi.comparison.comparator.ScanComparator;
import com.mendesvincs.nmapscannerapi.comparison.dto.ScanComparisonRequest;
import com.mendesvincs.nmapscannerapi.comparison.dto.ScanComparisonResponse;
import com.mendesvincs.nmapscannerapi.comparison.repository.ScanComparisonRepository;
import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;
import com.mendesvincs.nmapscannerapi.scan.service.NmapScannerService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class ScanComparisonService {

    private final ScanComparator scanComparator;
    private final ScanComparisonRepository scanComparisonRepository;
    private final NmapScannerService nmapScannerService;

    public ScanComparisonService(
            ScanComparator scanComparator,
            ScanComparisonRepository scanComparisonRepository,
            NmapScannerService nmapScannerService
    ) {
        this.scanComparator = scanComparator;
        this.scanComparisonRepository = scanComparisonRepository;
        this.nmapScannerService = nmapScannerService;
    }

    public ScanComparisonResponse compare(ScanComparisonRequest request) {
        ScanResult baseScan = resolveScan(request.getBaseScanId(), request.getBaseScan(), "baseScan");
        ScanResult newScan = resolveScan(request.getNewScanId(), request.getNewScan(), "newScan");

        ScanComparisonResponse comparison = scanComparator.compare(baseScan, newScan);
        comparison.setBaseScanId(baseScan.getId());
        comparison.setNewScanId(newScan.getId());

        return scanComparisonRepository.save(comparison);
    }

    private ScanResult resolveScan(String scanId, ScanResult scanResult, String fieldName) {
        if (scanId != null && !scanId.isBlank()) {
            return nmapScannerService.findById(scanId);
        }

        if (scanResult != null) {
            return scanResult;
        }

        throw new ResponseStatusException(
                BAD_REQUEST,
                "Missing " + fieldName + ". Provide " + fieldName + "Id or the full scan object."
        );
    }
}