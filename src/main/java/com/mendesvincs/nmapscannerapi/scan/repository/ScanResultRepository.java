package com.mendesvincs.nmapscannerapi.scan.repository;

import com.mendesvincs.nmapscannerapi.scan.model.ScanResult;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ScanResultRepository extends MongoRepository<ScanResult, String> {
	List<ScanResult> findAllByOrderByScanDateDesc();
}