import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../core/_services/user-auth.service';
import { UserService } from '../../core/_services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface User {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserAccountComponent implements OnInit {
  user: any = null; 
  loading: boolean = true;
  error: string | null = null;
  userAvatar: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    const token = this.userAuthService.getToken();
    if (token) {
      this.userService.getUserInfo(token).subscribe({
        next: (data: User) => {
          this.user = data;
          this.loading = false;
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

  editProfile(): void {
    this.router.navigate(['/candidat/modify-account']);
  }

  changePassword(): void {
    this.router.navigate(['/candidat/modify-account'], { queryParams: { mode: 'password' } });
  }
}
