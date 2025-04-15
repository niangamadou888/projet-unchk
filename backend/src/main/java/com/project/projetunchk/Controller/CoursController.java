package com.project.projetunchk.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.projetunchk.Entity.Cours;
import com.project.projetunchk.Service.CoursService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cours")
public class CoursController {

    private final CoursService coursService;

    public CoursController(CoursService coursService) {
        this.coursService = coursService;
    }

    @PostMapping(value = "/soumettre", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<Cours> soumettreCour(
            @RequestPart("cours") String courJson,
            @RequestPart(value = "courFile", required = false) MultipartFile courFile
    ) throws IOException {

        // Convert JSON String en Objet Candidature
        ObjectMapper objectMapper = new ObjectMapper();
        Cours cours = objectMapper.readValue(courJson, Cours.class);

        // Appel du service pour enregistrer la candidature
        Cours savedCour = coursService.createCours(cours, courFile);

        return ResponseEntity.ok(savedCour);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    public List<Cours> getAllCours() {
        return coursService.getAllCours();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    public Cours getCoursById(@PathVariable Long id) {
        return coursService.getCoursById(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public void deleteCours(@PathVariable Long id) {
        coursService.deleteCours(id);
    }

    @GetMapping("/download/{type}/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id, @PathVariable String type) throws IOException {
        Optional<Cours> courOptional = Optional.ofNullable(coursService.getCoursById(id));

        if (courOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cours cour = courOptional.get();
        String filePath = switch (type) {
            case "courFile" -> cour.getCourFile();
            default -> null;
        };

        if (filePath == null || filePath.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Path path = Path.of(filePath);
        byte[] fileContent = Files.readAllBytes(path);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + path.getFileName() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                .body(fileContent);
    }
}
