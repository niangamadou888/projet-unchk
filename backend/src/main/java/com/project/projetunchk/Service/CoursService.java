package com.project.projetunchk.Service;

import com.project.projetunchk.DAO.CoursDAO;
import com.project.projetunchk.Entity.Cours;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
public class CoursService {
    private final CoursDAO coursDAO;

    private static final String UPLOAD_DIR = "uploads/cours/";

    public CoursService(CoursDAO coursDAO) {
        this.coursDAO = coursDAO;
    }

    public List<Cours> getAllCours() {
        return coursDAO.findAll();
    }


    public Cours getCoursById(Long id) {
        return coursDAO.findById(id).orElseThrow(() -> new RuntimeException("Cours non trouvé"));
    }

    public Cours createCours(Cours cours, MultipartFile coursFile) throws IOException {
        if (coursFile != null && !coursFile.isEmpty()) {
            cours.setCourFile(saveFile(coursFile, "cours"));
        }
        return coursDAO.save(cours);
    }

    public void deleteCours(Long id) {
        coursDAO.deleteById(id);
    }

    private String saveFile(MultipartFile file, String type) throws IOException {
        String filename =  type + "_" + System.currentTimeMillis() + ".pdf";
        Path filePath = Paths.get(UPLOAD_DIR + filename);

        Files.createDirectories(filePath.getParent());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toString();
    }

}
