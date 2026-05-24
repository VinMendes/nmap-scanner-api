package com.mendesvincs.nmapscannerapi.controller;

import com.mendesvincs.nmapscannerapi.dto.ScanRequest;
import com.mendesvincs.nmapscannerapi.model.ScanResult;
import com.mendesvincs.nmapscannerapi.service.NmapScannerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scans")
public class NmapScannerController {

    private final NmapScannerService nmapScannerService;

    public NmapScannerController(NmapScannerService nmapScannerService) {
        this.nmapScannerService = nmapScannerService;
    }

    @PostMapping("/run")
    public ScanResult runScan(@RequestBody ScanRequest request) {
        return nmapScannerService.scan(request.getTarget());
    }
}