import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/_services/user.service';
import { UserAuthService } from '../../core/_services/user-auth.service';

interface User {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

@Component({
  selector: 'app-modify-account',
  templateUrl: './modify-account.component.html',
  styleUrls: ['./modify-account.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ModifyAccountComponent implements OnInit {
  user: User | null = null;
  loading: boolean = true;
  error: string | null = null;
  success: string | null = null;
  isChangingPassword: boolean = false;
  passwordResetEmail: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    // Check if we're in password change mode
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'password') {
        this.isChangingPassword = true;
      }
    });

    this.getUserInfo();
  }

  getUserInfo(): void {
    const token = this.userAuthService.getToken();
    if (token) {
      this.userService.getUserInfo(token).subscribe({
        next: (data: User) => {
          this.user = data;
          this.loading = false;
          if (this.isChangingPassword) {
            this.passwordResetEmail = data.userEmail;
          }
        },
        error: (error: Error) => {
          this.error = 'Échec de la récupération des données utilisateur.';
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  updateProfile(): void {
    const token = this.userAuthService.getToken();  // Get the token from storage
    this.userService.updateUserInfo(token, this.user).subscribe(
      (response) => {
        console.log('User info updated:', response);
        // Handle the success response (maybe show a success message or redirect)
        this.router.navigate(['/candidat/userDashbord']);
      },
      (error) => {
        console.log('Error updating user info:', error);
        // Handle the error response (maybe show an error message)
      }
    );
  }


  goBack(): void {
    this.router.navigate(['/candidat/userDashbord']);
  }

  cancelPasswordChange(): void {
    this.router.navigate(['/candidat/userDashbord']);
  }

  submitPasswordChange(): void {
    if (this.passwordResetEmail) {
      this.loading = true;
      this.error = null;
      this.success = null;

      this.userService.sendResetEmail(this.passwordResetEmail).subscribe(

 

        response => {
   
  
          alert('Un email de réinitialisation a été envoyé.');
   
  
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