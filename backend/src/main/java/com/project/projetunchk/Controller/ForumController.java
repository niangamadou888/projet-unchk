package com.project.projetunchk.Controller;

import com.project.projetunchk.Entity.Forum;
import com.project.projetunchk.Service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/forum")
public class ForumController {

    @Autowired
    private ForumService forumService;

    @PostMapping
    public ResponseEntity<Forum> createForum(@RequestBody Forum forum) {
        return new ResponseEntity<>(forumService.createForum(forum), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Forum>> getAllForums() {
        return new ResponseEntity<>(forumService.getAllForums(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Forum> getForumById(@PathVariable Long id) {
        Optional<Forum> forum = forumService.getForumById(id);
        return forum.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{userEmail}")
    public ResponseEntity<List<Forum>> getForumsByUserEmail(@PathVariable String userEmail) {
        List<Forum> forums = forumService.getForumsByUserEmail(userEmail);
        return new ResponseEntity<>(forums, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Forum> updateForum(@PathVariable Long id, @RequestBody Forum forum) {
        Optional<Forum> existingForum = forumService.getForumById(id);
        if (existingForum.isPresent()) {
            forum.setId(id);
            return new ResponseEntity<>(forumService.updateForum(forum), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForum(@PathVariable Long id) {
        Optional<Forum> existingForum = forumService.getForumById(id);
        if (existingForum.isPresent()) {
            forumService.deleteForum(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
} 