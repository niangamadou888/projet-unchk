package com.project.projetunchk.Controller;

import com.project.projetunchk.Entity.User;
import com.project.projetunchk.Service.JwtService;
import com.project.projetunchk.Service.UserService;
import com.project.projetunchk.Util.JwtUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostConstruct
    public void initRolesAndUsers() {
        userService.initRolesAndUser();
    }

    @PostMapping({"/registerNewUser"})
    public User registerNewUser(@RequestBody User user){
        return userService.registerNewUser(user);
    }

    @GetMapping({"forAdmin"})
    @PreAuthorize("hasRole('Admin')")
    public String forAdmin(){
        return "This URL is only accessible to admin";
    }

    @GetMapping({"forUser"})
    @PreAuthorize("hasRole('User')")
    public String forUser(){
        return "This URL is only accessible to the user";
    }

    @PutMapping("/{id}/suspend")
    @PreAuthorize("hasRole('Admin')")
    public void suspendUser(@PathVariable String id) {
        userService.suspendUser(id);
    }

    @GetMapping("/getUserInfo")
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<User> getUserInfo(@RequestHeader("Authorization") String token) {
        // Remove the "Bearer " prefix from the Authorization header
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            User user = jwtService.getUserByToken(token);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }
    }

    @PutMapping("/updateUserInfo")
    @PreAuthorize("hasRole('User')")
    public User updateUserInfo(@RequestBody User updatedUser, @RequestHeader("Authorization") String token) {
        String userEmail = extractUserEmailFromToken(token); // Extract user email from token
        return userService.updateUserInfo(updatedUser, userEmail);
    }

    private String extractUserEmailFromToken(String token) {
        return jwtUtil.extractUsername(token.replace("Bearer ", ""));
    }

    @PutMapping("/{id}/unsuspend")
    @PreAuthorize("hasRole('Admin')")
    public void unsuspendUser(@PathVariable String id) {
        userService.unsuspendUser(id);
    }
}
