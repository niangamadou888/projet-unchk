package com.project.projetunchk.DAO;

import com.project.projetunchk.Entity.Forum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumDAO extends JpaRepository<Forum, Long> {
    List<Forum> findByUserEmail(String userEmail);
} 