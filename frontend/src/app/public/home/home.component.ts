import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

  chooseInscription() {
    
    // Rediriger vers la page d'inscription
    this.router.navigate(['/inscription']);
  }


  chooseConnection() {
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/connexion']);
  }
}
