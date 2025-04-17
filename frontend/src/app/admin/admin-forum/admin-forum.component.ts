import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ForumService } from '../../core/_services/forum.service';
import { ForumMessage } from '../../core/models/forum-message.model';
import { UserAuthService } from '../../core/_services/user-auth.service';

@Component({
  selector: 'app-admin-forum',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-forum.component.html',
  styleUrls: ['./admin-forum.component.css']
})
export class AdminForumComponent implements OnInit {
  messages: ForumMessage[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  deletingMessageId: number | null = null;
  searchTerm: string = '';
  filteredMessages: ForumMessage[] = [];

  constructor(
    private forumService: ForumService,
    private userAuthService: UserAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading = true;
    this.error = null;
    
    this.forumService.getForumMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.filteredMessages = [...this.messages];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load forum messages. Please try again.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  deleteMessage(id: number | undefined): void {
    if (!id) return;
    this.deletingMessageId = id;
    
    if (confirm('Are you sure you want to delete this message?')) {
      this.forumService.deleteForumMessage(id).subscribe({
        next: () => {
          this.messages = this.messages.filter(msg => msg.id !== id);
          this.filteredMessages = this.filteredMessages.filter(msg => msg.id !== id);
          this.deletingMessageId = null;
        },
        error: (error) => {
          console.error('Error deleting message:', error);
          alert('Failed to delete message. Please try again.');
          this.deletingMessageId = null;
        }
      });
    } else {
      this.deletingMessageId = null;
    }
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredMessages = [...this.messages];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredMessages = this.messages.filter(message => 
      message.name.toLowerCase().includes(term) || 
      message.message.toLowerCase().includes(term)
    );
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.filteredMessages = [...this.messages];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/admin-dashbord']);
  }

  logout(): void {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }
} 