import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';

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
    
}
