package com.project.projetunchk.Controller;

import com.project.projetunchk.Entity.Role;
import com.project.projetunchk.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleController {
    @Autowired
    private RoleService roleService;



    @PostMapping({"/createNewRole"})
    public Role createRole(@RequestBody Role role){
        return roleService.createNewRole(role);
    }
}
