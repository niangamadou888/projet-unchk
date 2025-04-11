import { Component, NgModule } from '@angular/core';
import { UserService } from '../../core/_services/user.service';
import { FormsModule, NgForm,} from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../core/_services/user-auth.service';


@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.css'
})
export class ConnectionComponent {

  constructor(private router: Router,
              private userService : UserService,
              private userAuthService : UserAuthService){}

  chooseInscription(){
    this.router.navigate(['/form']);
  }

  connection(loginForm: NgForm){
    this.userService.connection(loginForm.value).subscribe(
      (Response: any) => {
        if (!Response.user || !Array.isArray(Response.user.role) || Response.user.role.length === 0) {
          alert('Erreur : Rôle utilisateur non défini');
          return;
      }
        this.userAuthService.setRoles(Response.user.role);
        this.userAuthService.setToken(Response.jwtToken);

        const role = Response.user.role[0].roleName;
        if(role === 'Admin'){
          this.router.navigate(['/admin/admin-dashbord']);
        } else {
          this.router.navigate(['/candidat/userDashbord']);
        }
      },
      (error)=>{
        console.log(error);
        alert('Email ou Mot de passe incorrect. Veuillez réessayer.');
      }
    );
  }
}

