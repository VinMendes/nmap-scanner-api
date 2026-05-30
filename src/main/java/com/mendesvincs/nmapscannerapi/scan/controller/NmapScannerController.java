package com.mendesvincs.nmapscannerapi.scan.controller;

import com.mendesvincs.nmapscannerapi.scan.dto.ScanRequest;
import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;
import com.mendesvincs.nmapscannerapi.scan.service.NmapScannerService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scans")
public class NmapScannerController {

    private final NmapScannerService nmapScannerService;

    public NmapScannerController(
            NmapScannerService nmapScannerService
    ) {
        this.nmapScannerService = nmapScannerService;
    }

    @PostMapping("/run")
    public ScanResult runScan(@RequestBody ScanRequest request) {
        return nmapScannerService.scan(request.getTarget());
    }

    @GetMapping
    public List<ScanResult> listScans() {
        return nmapScannerService.findAll();
    }

    @GetMapping("/latest")
    public ScanResult getLatestScan() {
        return nmapScannerService.findLatest();
    }

    @GetMapping("/targets")
    public List<String> listTargets() {
        return nmapScannerService.findAllTargets();
    }

    @GetMapping("/by-target")
    public List<ScanResult> listScansByTargetQuery(@RequestParam String target) {
        return nmapScannerService.findByTarget(target);
    }

    @GetMapping("/target/{target}")
    public List<ScanResult> listScansByTarget(@PathVariable String target) {
        return nmapScannerService.findByTarget(target);
    }

    @GetMapping("/{scanId}")
    public ScanResult getScan(@PathVariable String scanId) {
        return nmapScannerService.findById(scanId);
    }
}