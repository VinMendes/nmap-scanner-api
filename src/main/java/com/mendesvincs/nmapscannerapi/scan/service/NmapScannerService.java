package com.mendesvincs.nmapscannerapi.scan.service;

import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;
import com.mendesvincs.nmapscannerapi.scan.parser.NmapXmlParser;
import com.mendesvincs.nmapscannerapi.scan.repository.ScanResultRepository;
import com.mendesvincs.nmapscannerapi.scan.scanner.NmapCommandExecutor;
import org.springframework.stereotype.Service;

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
}