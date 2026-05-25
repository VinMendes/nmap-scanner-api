package com.mendesvincs.nmapscannerapi.scan.service;

import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;
import com.mendesvincs.nmapscannerapi.scan.scanner.NmapCommandExecutor;
import com.mendesvincs.nmapscannerapi.scan.parser.NmapXmlParser;
import org.springframework.stereotype.Service;

@Service
public class NmapScannerService {

    private final NmapCommandExecutor nmapCommandExecutor;
    private final NmapXmlParser nmapXmlParser;

    public NmapScannerService(
            NmapCommandExecutor nmapCommandExecutor,
            NmapXmlParser nmapXmlParser
    ) {
        this.nmapCommandExecutor = nmapCommandExecutor;
        this.nmapXmlParser = nmapXmlParser;
    }

    public ScanResult scan(String target) {
        String xmlOutput = nmapCommandExecutor.execute(target);

        return nmapXmlParser.parse(target, xmlOutput);
    }
}