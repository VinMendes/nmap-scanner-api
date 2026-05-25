package com.mendesvincs.nmapscannerapi.scan.parser;

import com.mendesvincs.nmapscannerapi.scan.model.HostResult;
import com.mendesvincs.nmapscannerapi.scan.model.PortResult;
import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;

@Component
public class NmapXmlParser {

    /*
     * Classe responsável por converter o XML gerado pelo Nmap
     * em objetos Java do nosso sistema.
     *
     * Essa separação deixa o NmapScannerService mais limpo.
     */

    public ScanResult parse(String target, String xmlContent) {
        ScanResult scanResult = new ScanResult(target);

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            Document document = builder.parse(
                    new InputSource(new StringReader(xmlContent))
            );

            document.getDocumentElement().normalize();

            NodeList hostNodes = document.getElementsByTagName("host");

            for (int i = 0; i < hostNodes.getLength(); i++) {
                Element hostElement = (Element) hostNodes.item(i);

                HostResult hostResult = parseHost(hostElement);

                scanResult.addHost(hostResult);
            }

            return scanResult;

        } catch (Exception exception) {
            throw new RuntimeException("Erro ao processar XML do Nmap: " + exception.getMessage(), exception);
        }
    }

    private HostResult parseHost(Element hostElement) {
        String ip = getHostAddress(hostElement);
        String status = getHostStatus(hostElement);

        HostResult hostResult = new HostResult(ip, status);

        NodeList portNodes = hostElement.getElementsByTagName("port");

        for (int i = 0; i < portNodes.getLength(); i++) {
            Element portElement = (Element) portNodes.item(i);

            PortResult portResult = parsePort(portElement);

            hostResult.addPort(portResult);
        }

        return hostResult;
    }

    private PortResult parsePort(Element portElement) {
        String protocol = portElement.getAttribute("protocol");
        Integer portNumber = Integer.parseInt(portElement.getAttribute("portid"));

        Element stateElement = getFirstElement(portElement, "state");

        String state = stateElement != null
                ? stateElement.getAttribute("state")
                : "";

        Element serviceElement = getFirstElement(portElement, "service");

        String service = "";
        String product = "";
        String version = "";

        if (serviceElement != null) {
            service = serviceElement.getAttribute("name");
            product = serviceElement.getAttribute("product");
            version = serviceElement.getAttribute("version");
        }

        return new PortResult(
                portNumber,
                protocol,
                state,
                service,
                product,
                version
        );
    }

    private String getHostAddress(Element hostElement) {
        Element addressElement = getFirstElement(hostElement, "address");

        if (addressElement == null) {
            return "";
        }

        return addressElement.getAttribute("addr");
    }

    private String getHostStatus(Element hostElement) {
        Element statusElement = getFirstElement(hostElement, "status");

        if (statusElement == null) {
            return "";
        }

        return statusElement.getAttribute("state");
    }

    private Element getFirstElement(Element parentElement, String tagName) {
        NodeList nodes = parentElement.getElementsByTagName(tagName);

        if (nodes.getLength() == 0) {
            return null;
        }

        return (Element) nodes.item(0);
    }
}