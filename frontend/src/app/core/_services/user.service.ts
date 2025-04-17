import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { catchError, Observable, throwError } from 'rxjs';

interface User {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

PATH_OF_API = "http://localhost:8080";

RequestHeader=new HttpHeaders({
    "No-Auth":"True"
}
)
  constructor(private httpclient: HttpClient,
    private userAuthService: UserAuthService) { }

  public register(userData:{}){
    return this.httpclient.post(
      this.PATH_OF_API + "/registerNewUser", userData);
  }

  public connection(connectionData:{email:string; password: string}){
    
    // Récupère le token JWT du localStorage (si déjà connecté)
    const token = localStorage.getItem('jwtToken');

    // Ajoute le token à l'en-tête 'Authorization' si il existe
    if (token) {
      this.RequestHeader = this.RequestHeader.set('Authorization', `Bearer ${token}`);
    }
     return this.httpclient.post(
      this.PATH_OF_API + "/authenticate", connectionData,
      {headers: this.RequestHeader})
  }
  
  public roleMatch(allowedRoles: string[]): boolean {
    let isMatch=false;
    const userRoles : any=this.userAuthService.getRoles();

    if (userRoles !== null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for(let j = 0; j < allowedRoles.length; j++){
          if(userRoles[i].roleName === allowedRoles[j]){
            isMatch = true;
            return isMatch;
          }else{
            return isMatch;
          }

        }
      }
    }
    return false;
  }

  getUserInfo(token: string): Observable<User> {
 

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 

    return this.httpclient.get<User>(`${this.PATH_OF_API}/getUserInfo`, { headers });
 

  }
    
  updateUserProfile(userData: User): Observable<User> {
    const token = this.userAuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpclient.put<User>(`${this.PATH_OF_API}/updateUserProfile`, userData, { headers });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.httpclient.post(`${this.PATH_OF_API}/requestPasswordReset`, { email }, { headers: this.RequestHeader });
  }

  updateUserInfo(token: string, user: any): Observable<any> {
 

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 

    return this.httpclient.put<any>(`${this.PATH_OF_API}/updateUserInfo`, user, { headers });
 

  }

  sendResetEmail(userEmail: string): Observable<any> {
    const payload = { userEmail };

    return this.httpclient.post(`${this.PATH_OF_API}/forgot-password`, payload, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Error details:', error);
        return throwError(() => 'Une erreur est survenue lors de la réinitialisation du mot de passe.');
      })
    );
  }
 


 

  resetPassword(token: string, newPassword: string): Observable<any> {
    const body = { newPassword };
    return this.httpclient.post<any>(
      `${this.PATH_OF_API}/reset-password?token=${token}`, 
      body,
      { responseType: 'text' as 'json' }
    ).pipe(
      catchError((error) => {
        console.error('Error during password reset:', error);
        return throwError(() => 'Une erreur est survenue lors de la réinitialisation de votre mot de passe.');
      })
    );
  }
}
