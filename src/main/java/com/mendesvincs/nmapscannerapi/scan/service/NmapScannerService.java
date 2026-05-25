package com.mendesvincs.nmapscannerapi.scan.service;

import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;
import com.mendesvincs.nmapscannerapi.scan.parser.NmapXmlParser;
import com.mendesvincs.nmapscannerapi.scan.repository.ScanResultRepository;
import com.mendesvincs.nmapscannerapi.scan.scanner.NmapCommandExecutor;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class NmapScannerService {

    private final NmapCommandExecutor nmapCommandExecutor;
    private final NmapXmlParser nmapXmlParser;
    private final ScanResultRepository scanResultRepository;

    public NmapScannerService(
            NmapCommandExecutor nmapCommandExecutor,
            NmapXmlParser nmapXmlParser,
            ScanResultRepository scanResultRepository
    ) {
        this.nmapCommandExecutor = nmapCommandExecutor;
        this.nmapXmlParser = nmapXmlParser;
        this.scanResultRepository = scanResultRepository;
    }

    public ScanResult scan(String target) {
        String xmlOutput = nmapCommandExecutor.execute(target);
        ScanResult scanResult = nmapXmlParser.parse(target, xmlOutput);

        return scanResultRepository.save(scanResult);
    }

    public List<ScanResult> findAll() {
        return scanResultRepository.findAllByOrderByScanDateDesc();
    }

    public ScanResult findById(String scanId) {
        return scanResultRepository.findById(scanId)
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND,
                        "Scan not found: " + scanId
                ));
    }
}