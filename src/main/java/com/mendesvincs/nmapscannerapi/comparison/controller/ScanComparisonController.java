package com.mendesvincs.nmapscannerapi.comparison.controller;

import com.mendesvincs.nmapscannerapi.comparison.dto.ScanComparisonRequest;
import com.mendesvincs.nmapscannerapi.comparison.dto.ScanComparisonResponse;
import com.mendesvincs.nmapscannerapi.comparison.service.ScanComparisonService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scans")
public class ScanComparisonController {

    private final ScanComparisonService scanComparisonService;

    public ScanComparisonController(ScanComparisonService scanComparisonService) {
        this.scanComparisonService = scanComparisonService;
    }

    @PostMapping("/compare")
    public ScanComparisonResponse compareScans(@RequestBody ScanComparisonRequest request) {
        return scanComparisonService.compare(request);
    }
}