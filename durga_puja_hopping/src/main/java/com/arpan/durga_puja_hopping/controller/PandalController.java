package com.arpan.durga_puja_hopping.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.arpan.durga_puja_hopping.dto.PandalCreateRequest;
import com.arpan.durga_puja_hopping.dto.PandalResponse;
import com.arpan.durga_puja_hopping.entity.PandalDtls;
import com.arpan.durga_puja_hopping.entity.PandalDtls.Status;
import com.arpan.durga_puja_hopping.entity.UserDtls;
import com.arpan.durga_puja_hopping.repository.PandalRepository;
import com.arpan.durga_puja_hopping.repository.UserDtlsRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pandals")
@RequiredArgsConstructor //constructor injection
public class PandalController {

    private static final Logger logger =
            LoggerFactory.getLogger(PandalController.class);

    private final PandalRepository pandalRepository;
    private final UserDtlsRepository userRepository;
    
    /* ===================== MAPPER ===================== */
    private PandalResponse mapToDTO(PandalDtls p) {
        PandalResponse dto = new PandalResponse();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setAddress(p.getAddress());
        dto.setZone(p.getZone());
        dto.setDetails(p.getDetails());
        dto.setStatus(p.getStatus());
        dto.setCreatedById(p.getCreatedBy().getId());
        dto.setCreatedByName(p.getCreatedBy().getName());
        dto.setCreatedByEmail(p.getCreatedBy().getEmail());
        return dto;
    }

    /* ======================================================
     * 1️⃣ AUTHORITY APIs
     * ====================================================== */

    @Operation(
        summary = "Create new pandal request",
        description = "Authority submits a new pandal. Status is set to PENDING."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Pandal request created successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied – Authority only"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    @PreAuthorize("hasRole('AUTHORITY')")
    public ResponseEntity<PandalResponse> createPandal(
            @RequestBody PandalCreateRequest request,
            Authentication authentication
    ) {
        logger.info("Authority {} creating pandal", authentication.getName());

        UserDtls authority = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authority not found"));

        PandalDtls pandal = new PandalDtls();
        pandal.setName(request.getName());
        pandal.setAddress(request.getAddress());
        pandal.setZone(request.getZone());
        pandal.setDetails(request.getDetails());

        // 🔐 SERVER-CONTROLLED FIELDS
        pandal.setCreatedBy(authority);
        pandal.setStatus(Status.PENDING);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToDTO(pandalRepository.save(pandal)));
    }

    @Operation(
        summary = "Get pandals created by authority",
        description = "Returns all pandals submitted by the logged-in Authority"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pandals retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied – Authority only")
    })
    @GetMapping("/my-pandals")
    @PreAuthorize("hasRole('AUTHORITY')")
    public ResponseEntity<List<PandalDtls>> getMyPandals(
            Authentication authentication
    ) {
        logger.info("GET /api/pandals/my-pandals called by {}", authentication.getName());

        List<PandalDtls> pandals =
                pandalRepository.findByCreatedByEmail(authentication.getName());

        return ResponseEntity.ok(pandals);
    }
    
    @Operation(
    	    summary = "Update own pandal",
    	    description = "Allows an AUTHORITY to update only the pandals they created. "
    	                + "Ownership is verified using the logged-in user's email from JWT."
    	)
    	@ApiResponses(value = {
    	    @ApiResponse(responseCode = "200", description = "Pandal updated successfully"),
    	    @ApiResponse(responseCode = "401", description = "Unauthorized – JWT missing or invalid"),
    	    @ApiResponse(responseCode = "403", description = "Forbidden – Not the owner or not an AUTHORITY"),
    	    @ApiResponse(responseCode = "404", description = "Pandal not found")
    	})
    	@PutMapping("/{id}")
    	@PreAuthorize("hasRole('AUTHORITY')")
    	public ResponseEntity<PandalResponse> updateOwnPandal(
    	        @PathVariable Long id,
    	        @RequestBody PandalCreateRequest request,
    	        Authentication authentication
    	) {
    	    logger.info(
    	        "PUT /api/pandals/{} requested by AUTHORITY {}",
    	        id,
    	        authentication.getName()
    	    );

    	    String email = authentication.getName();

    	    PandalDtls pandal = pandalRepository.findById(id)
    	            .orElseThrow(() -> {
    	                logger.warn("Pandal with id {} not found", id);
    	                return new RuntimeException("Pandal not found");
    	            });

    	    // 🔐 OWNERSHIP CHECK
    	    if (!pandal.getCreatedBy().getEmail().equals(email)) {
    	        logger.warn(
    	            "Unauthorized update attempt on pandal {} by {} (owner: {})",
    	            id,
    	            email,
    	            pandal.getCreatedBy().getEmail()
    	        );
    	        throw new RuntimeException("You are not allowed to edit this pandal");
    	    }

    	    // ✅ Editable fields only
    	    pandal.setName(request.getName());
    	    pandal.setAddress(request.getAddress());
    	    pandal.setZone(request.getZone());
    	    pandal.setDetails(request.getDetails());

    	    PandalDtls updated = pandalRepository.save(pandal);

    	    logger.info(
    	        "Pandal {} successfully updated by AUTHORITY {}",
    	        id,
    	        email
    	    );

    	    return ResponseEntity.ok(mapToDTO(updated));
    	}

    /* ======================================================
     * 2️⃣ PUBLIC APIs
     * ====================================================== */

	@Operation(
        summary = "Get approved pandals",
        description = "Public API to fetch all APPROVED pandals"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Approved pandals retrieved")
    })
    @GetMapping("/approved")
    public ResponseEntity<List<PandalDtls>> getApprovedPandals() {
        logger.info("GET /api/pandals/approved called (public)");

        List<PandalDtls> pandals =
                pandalRepository.findByStatus(Status.APPROVED);

        return ResponseEntity.ok(pandals);
    }

    /* ======================================================
     * 3️⃣ ADMIN APIs
     * ====================================================== */

	@Operation(
		    summary = "Get all pending pandal requests(Admin only)",
		    description = "Admin-only endpoint to fetch all pandals with PENDING status "
		                + "for moderation and approval."
		)
		@ApiResponses(value = {
		    @ApiResponse(responseCode = "200", description = "Pending pandals retrieved successfully"),
		    @ApiResponse(responseCode = "401", description = "Unauthorized – JWT missing or invalid"),
		    @ApiResponse(responseCode = "403", description = "Forbidden – Admin access required")
		})
		@GetMapping("/admin/pending")
		@PreAuthorize("hasRole('ADMIN')")
		public ResponseEntity<List<PandalResponse>> getPendingPandals() {

		    logger.info("GET /api/pandals/admin/pending requested by ADMIN");

		    List<PandalResponse> response =
		            pandalRepository.findByStatus(PandalDtls.Status.PENDING)
		                    .stream()
		                    .map(this::mapToDTO)
		                    .toList();

		    logger.info(
		        "Admin fetched {} pending pandal request(s)",
		        response.size()
		    );

		    return ResponseEntity.ok(response);
		}

    @Operation(
        summary = "Approve a pandal(Admin only)",
        description = "Admin approves a pandal request"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pandal approved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied – Admin only"),
        @ApiResponse(responseCode = "404", description = "Pandal not found")
    })
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PandalResponse> approvePandal(
            @PathVariable Long id
    ) {
        logger.info("PUT /api/pandals/{}/approve called by ADMIN", id);

        PandalDtls pandal = pandalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pandal not found"));

        pandal.setStatus(Status.APPROVED);
        return ResponseEntity.ok(mapToDTO(pandalRepository.save(pandal)));
    }

    @Operation(
        summary = "Delete a pandal(Admin only)",
        description = "Admin deletes any pandal"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Pandal deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied – Admin only")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePandal(
            @PathVariable Long id
    ) {
        logger.warn("DELETE /api/pandals/{} called by ADMIN", id);

        pandalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
