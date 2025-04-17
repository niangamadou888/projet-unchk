import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/_services/user.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-modify-password',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.css']
})
export class ModifyPasswordComponent implements OnInit {
  token: string | null = null;
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = 'Token de réinitialisation invalide ou manquant.';
      setTimeout(() => {
        this.router.navigate(['/connexion']);
      }, 3000);
    }
  }

  submitNewPassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.newPassword.length < 8) {
      this.error = 'Le mot de passe doit contenir au moins 8 caractères.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.userService.resetPassword(this.token!, this.newPassword).subscribe({
      next: (success) => {
        this.success = success;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/connexion']);
        }, 3000);
      },
      error: (error) => {
        this.error = 'Échec de la réinitialisation du mot de passe. Le lien a peut-être expiré.';
        this.loading = false;
        console.error('Password reset error:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/connexion']);
  }
} 