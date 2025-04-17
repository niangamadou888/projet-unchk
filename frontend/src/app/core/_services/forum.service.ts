import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserAuthService } from './user-auth.service';
import { ForumMessage } from '../models/forum-message.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private PATH_OF_API = "http://localhost:8080";

  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) { }

  // Get all forum messages
  getForumMessages(): Observable<ForumMessage[]> {
    const token = this.userAuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<ForumMessage[]>(`${this.PATH_OF_API}/forum`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching forum messages:', error);
          return throwError(() => 'Une erreur est survenue lors du chargement des messages du forum.');
        })
      );
  }

  // Post a new forum message
  postForumMessage(message: Omit<ForumMessage, 'id' | 'createdAt'>): Observable<ForumMessage> {
    const token = this.userAuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post<ForumMessage>(`${this.PATH_OF_API}/forum`, message, { headers })
      .pipe(
        catchError(error => {
          console.error('Error posting forum message:', error);
          return throwError(() => 'Une erreur est survenue lors de la publication du message.');
        })
      );
  }

  // Delete a forum message
  deleteForumMessage(messageId: number): Observable<void> {
    const token = this.userAuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.delete<void>(`${this.PATH_OF_API}/forum/${messageId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting forum message:', error);
          return throwError(() => 'Une erreur est survenue lors de la suppression du message.');
        })
      );
  }
} 