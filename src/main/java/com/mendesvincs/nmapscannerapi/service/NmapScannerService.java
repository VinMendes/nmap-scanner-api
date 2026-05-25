package com.mendesvincs.nmapscannerapi.service;

import com.mendesvincs.nmapscannerapi.model.ScanResult;
import com.mendesvincs.nmapscannerapi.scanner.NmapCommandExecutor;
import com.mendesvincs.nmapscannerapi.parser.NmapXmlParser;
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