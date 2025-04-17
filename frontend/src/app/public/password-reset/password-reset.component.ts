import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/_services/user.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  email: string = '';
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  passwordResetEmail: string = '';

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  goBack(): void {
    this.router.navigate(['/connexion']);
  }

  submitPasswordChange(): void {
    if (this.passwordResetEmail) {
      this.loading = true;
      this.error = null;
      this.success = null;

      this.userService.sendResetEmail(this.passwordResetEmail).subscribe(

 

        response => {
   
  
          alert(response);
   
  
          this.router.navigate(['/']); // Or wherever you want to redirect after success
   
  
        },
   
  
        error => {
   
  
          console.error('Erreur lors de l\'envoi de l\'email', error);
   
  
          alert('Une erreur est survenue. Veuillez réessayer.');
   
  
        }
   
  
      );
    }
  }
} 