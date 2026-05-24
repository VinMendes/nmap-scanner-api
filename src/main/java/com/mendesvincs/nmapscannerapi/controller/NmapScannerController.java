package com.mendesvincs.nmapscannerapi.controller;

import com.mendesvincs.nmapscannerapi.model.ScanResult;
import com.mendesvincs.nmapscannerapi.service.NmapScannerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NmapScannerController {

    private final NmapScannerService nmapScannerService;

    public NmapScannerController(NmapScannerService nmapScannerService) {
        this.nmapScannerService = nmapScannerService;
    }

    @GetMapping("/api/scans/run")
    public ScanResult runScan(@RequestParam String target) {
        return nmapScannerService.scan(target);
    }
}