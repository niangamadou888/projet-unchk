package com.project.projetunchk.DAO;

import com.project.projetunchk.Entity.Cours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoursDAO extends JpaRepository<Cours, Long> {
}
