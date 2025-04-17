package com.project.projetunchk.Service;

import com.project.projetunchk.DAO.ForumDAO;
import com.project.projetunchk.Entity.Forum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ForumService {

    @Autowired
    private ForumDAO forumDAO;

    public Forum createForum(Forum forum) {
        return forumDAO.save(forum);
    }

    public List<Forum> getAllForums() {
        return forumDAO.findAll();
    }

    public Optional<Forum> getForumById(Long id) {
        return forumDAO.findById(id);
    }

    public List<Forum> getForumsByUserEmail(String userEmail) {
        return forumDAO.findByUserEmail(userEmail);
    }

    public Forum updateForum(Forum forum) {
        return forumDAO.save(forum);
    }

    public void deleteForum(Long id) {
        forumDAO.deleteById(id);
    }
} 