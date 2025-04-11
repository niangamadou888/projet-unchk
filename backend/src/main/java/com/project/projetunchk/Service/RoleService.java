package com.project.projetunchk.Service;

import com.project.projetunchk.DAO.RoleDAO;
import com.project.projetunchk.Entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
    @Autowired
    private RoleDAO roleDAO;

    public Role createNewRole(Role role){
        return roleDAO.save(role);
    }
}
