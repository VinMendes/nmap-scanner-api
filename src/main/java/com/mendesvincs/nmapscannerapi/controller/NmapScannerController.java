package com.mendesvincs.nmapscannerapi.controller;

import com.mendesvincs.nmapscannerapi.dto.ScanRequest;
import com.mendesvincs.nmapscannerapi.dto.comparison.ScanComparisonRequest;
import com.mendesvincs.nmapscannerapi.dto.comparison.ScanComparisonResponse;
import com.mendesvincs.nmapscannerapi.model.ScanResult;
import com.mendesvincs.nmapscannerapi.service.NmapScannerService;
import com.mendesvincs.nmapscannerapi.service.ScanComparisonService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scans")
public class NmapScannerController {

    private final NmapScannerService nmapScannerService;
    private final ScanComparisonService scanComparisonService;

    public NmapScannerController(
            NmapScannerService nmapScannerService,
            ScanComparisonService scanComparisonService
    ) {
        this.nmapScannerService = nmapScannerService;
        this.scanComparisonService = scanComparisonService;
    }

    @PostMapping("/run")
    public ScanResult runScan(@RequestBody ScanRequest request) {
        return nmapScannerService.scan(request.getTarget());
    }

    @PostMapping("/compare")
    public ScanComparisonResponse compareScans(@RequestBody ScanComparisonRequest request) {
        return scanComparisonService.compare(
                request.getBaseScan(),
                request.getNewScan()
        );
    }
}