import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidat-layout',
  standalone: true,  // Pape, c'est cette ligne qui manquait
  imports: [FooterComponent, RouterOutlet, CommonModule],
  templateUrl: './candidat-layout.component.html',
  styleUrl: './candidat-layout.component.css'
})
export class CandidatLayoutComponent {

}
