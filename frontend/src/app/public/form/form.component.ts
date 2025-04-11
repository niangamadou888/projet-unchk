import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/_services/user.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

 constructor(private router: Router,
  private userService : UserService
 ) {}

  chooseConnection() {
    this.router.navigate(['/connection']);
  }

  form(signupForm: NgForm) {
    if(signupForm.valid){
      const userData = signupForm.value; //Récupère les données du formulaire
      this.userService.register(userData).subscribe(
        (response) => {
          console.log('Inscription réussie', response);
          alert('Inscription réussie !');
          this.router.navigate(['/connection'])
        },
        (error) => {
          console.log('Erreur lors de l\'inscription', error);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      );
    }else{
      alert('Veillez remplir tous les champs correctement')
    }
  }
  
}