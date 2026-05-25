package com.mendesvincs.nmapscannerapi.comparison.comparator;

import com.mendesvincs.nmapscannerapi.comparison.dto.*;
import com.mendesvincs.nmapscannerapi.scan.model.HostResult;
import com.mendesvincs.nmapscannerapi.scan.model.PortResult;
import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ScanComparator {

    public ScanComparisonResponse compare(ScanResult baseScan, ScanResult newScan) {
        ScanComparisonResponse response = new ScanComparisonResponse();

        response.setTarget(newScan.getTarget());
        response.setBaseScanDate(baseScan.getScanDate());
        response.setNewScanDate(newScan.getScanDate());

        Map<String, HostResult> baseHosts = mapHostsByIp(baseScan);
        Map<String, HostResult> newHosts = mapHostsByIp(newScan);

        compareHosts(response, baseHosts, newHosts);
        updateSummary(response);

        return response;
    }

    private void compareHosts(
            ScanComparisonResponse response,
            Map<String, HostResult> baseHosts,
            Map<String, HostResult> newHosts
    ) {
        for (String ip : newHosts.keySet()) {
            if (!baseHosts.containsKey(ip)) {
                response.getNewHosts().add(newHosts.get(ip));
            }
        }

        for (String ip : baseHosts.keySet()) {
            if (!newHosts.containsKey(ip)) {
                response.getRemovedHosts().add(baseHosts.get(ip));
            }
        }

        for (String ip : newHosts.keySet()) {
            if (!baseHosts.containsKey(ip)) {
                continue;
            }

            HostResult baseHost = baseHosts.get(ip);
            HostResult newHost = newHosts.get(ip);

            HostDifference hostDifference = compareSingleHost(baseHost, newHost);

            if (hostDifference.hasDifferences()) {
                response.getHostDifferences().add(hostDifference);
            }
        }
    }

    private HostDifference compareSingleHost(HostResult baseHost, HostResult newHost) {
        HostDifference difference = new HostDifference();

        difference.setIp(newHost.getIp());
        difference.setStatusBefore(baseHost.getStatus());
        difference.setStatusAfter(newHost.getStatus());

        Map<String, PortResult> basePorts = mapPortsByKey(baseHost);
        Map<String, PortResult> newPorts = mapPortsByKey(newHost);

        for (String portKey : newPorts.keySet()) {
            if (!basePorts.containsKey(portKey)) {
                difference.getOpenedPorts().add(newPorts.get(portKey));
            }
        }

        for (String portKey : basePorts.keySet()) {
            if (!newPorts.containsKey(portKey)) {
                difference.getClosedPorts().add(basePorts.get(portKey));
            }
        }

        for (String portKey : newPorts.keySet()) {
            if (!basePorts.containsKey(portKey)) {
                continue;
            }

            PortResult basePort = basePorts.get(portKey);
            PortResult newPort = newPorts.get(portKey);

            if (portChanged(basePort, newPort)) {
                difference.getChangedPorts().add(
                        new PortDifference(
                                newPort.getPort(),
                                newPort.getProtocol(),
                                basePort,
                                newPort
                        )
                );
            }
        }

        return difference;
    }

    private boolean portChanged(PortResult basePort, PortResult newPort) {
        return !safeEquals(basePort.getState(), newPort.getState())
                || !safeEquals(basePort.getService(), newPort.getService())
                || !safeEquals(basePort.getProduct(), newPort.getProduct())
                || !safeEquals(basePort.getVersion(), newPort.getVersion());
    }

    private Map<String, HostResult> mapHostsByIp(ScanResult scanResult) {
        Map<String, HostResult> hostsByIp = new HashMap<>();

        for (HostResult host : scanResult.getHosts()) {
            hostsByIp.put(host.getIp(), host);
        }

        return hostsByIp;
    }

    private Map<String, PortResult> mapPortsByKey(HostResult host) {
        Map<String, PortResult> portsByKey = new HashMap<>();

        for (PortResult port : host.getPorts()) {
            portsByKey.put(buildPortKey(port), port);
        }

        return portsByKey;
    }

    private String buildPortKey(PortResult port) {
        return port.getProtocol() + ":" + port.getPort();
    }

    private boolean safeEquals(String first, String second) {
        if (first == null && second == null) {
            return true;
        }

        if (first == null || second == null) {
            return false;
        }

        return first.equals(second);
    }

    private void updateSummary(ScanComparisonResponse response) {
        ScanComparisonSummary summary = response.getSummary();

        summary.setNewHosts(response.getNewHosts().size());
        summary.setRemovedHosts(response.getRemovedHosts().size());
        summary.setChangedHosts(response.getHostDifferences().size());

        int openedPorts = 0;
        int closedPorts = 0;
        int changedPorts = 0;

        for (HostDifference difference : response.getHostDifferences()) {
            openedPorts += difference.getOpenedPorts().size();
            closedPorts += difference.getClosedPorts().size();
            changedPorts += difference.getChangedPorts().size();
        }

        summary.setOpenedPorts(openedPorts);
        summary.setClosedPorts(closedPorts);
        summary.setChangedPorts(changedPorts);
    }
}