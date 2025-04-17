import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ForumService } from '../../core/_services/forum.service';
import { ForumMessage } from '../../core/models/forum-message.model';
import { UserAuthService } from '../../core/_services/user-auth.service';
import { UserService } from '../../core/_services/user.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  messages: ForumMessage[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  userName: string = '';
  name: string = '';
  userEmail: string = '';
  isSubmitting: boolean = false;
  
  // Navbar properties
  activeTab: string = 'forum';
  notificationCount: number = 2;
  showProfileMenu: boolean = false;

  constructor(
    private forumService: ForumService,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadMessages();
  }

  loadUserInfo(): void {
    const token = this.userAuthService.getToken();
    if (token) {
      this.userService.getUserInfo(token).subscribe({
        next: (userInfo) => {
          this.name = `${userInfo.userFirstName} ${userInfo.userLastName}`;
          this.userName = this.name; // Keep userName for navbar
          this.userEmail = userInfo.userEmail;
        },
        error: (error) => {
          console.error('Error fetching user info:', error);
        }
      });
    }
  }

  loadMessages(): void {
    this.isLoading = true;
    this.error = null;
    
    this.forumService.getForumMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Impossible de charger les messages du forum. Veuillez réessayer.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  postMessage(): void {
    if (!this.newMessage.trim()) return;
    
    this.isSubmitting = true;
    
    const messageData = {
      name: this.name,
      message: this.newMessage.trim(),
      userEmail: this.userEmail
    };
    
    this.forumService.postForumMessage(messageData).subscribe({
      next: (message) => {
        this.messages.unshift(message);
        this.newMessage = '';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error posting message:', error);
        this.isSubmitting = false;
      }
    });
  }

  deleteMessage(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message?')) {
      this.forumService.deleteForumMessage(id).subscribe({
        next: () => {
          this.messages = this.messages.filter(msg => msg.id !== id);
        },
        error: (error) => {
          console.error('Error deleting message:', error);
        }
      });
    }
  }

  canDeleteMessage(message: ForumMessage): boolean {
    return message.userEmail === this.userEmail;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Navbar methods
  navigateTo(tab: string): void {
    if (tab === 'cours' || tab === 'notifications' || tab === 'compte') {
      this.router.navigate(['/candidat/userDashbord']);
    }
  }
  
  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }
  
  logout(): void {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }
} 