package com.mendesvincs.nmapscannerapi.comparison.repository;

import com.mendesvincs.nmapscannerapi.comparison.dto.ScanComparisonResponse;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ScanComparisonRepository extends MongoRepository<ScanComparisonResponse, String> {
}