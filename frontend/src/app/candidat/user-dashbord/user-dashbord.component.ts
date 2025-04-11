import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AnnonceService } from '../../core/_services/annonce.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashbord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashbord.component.html',
  styleUrl: './user-dashbord.component.css'
})
export class UserDashbordComponent {
  annonces: any[] = [];

  constructor(
    private router:Router,
    private annonceService : AnnonceService ){}


  ngOnInit(): void {
    // Charger les annonces au démarrage du composant
    this.annonceService.getAnnonces().subscribe((data) => {
      this.annonces = data;
      console.log(this.annonces);
      });
    }

   choosePostuler(){
    this.router.navigate(['/candidat/form-candidature']);
  }
   chooseCandidature(){
    this.router.navigate(['/candidat/candidature'])
   }

   chooseCompte(){
    this.router.navigate(['/candidat/compte'])
   }
}
