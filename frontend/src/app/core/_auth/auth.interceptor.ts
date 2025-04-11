import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { UserAuthService } from "../_services/user-auth.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private userAuthService: UserAuthService,
        private router:Router
    ){}
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler): 
        Observable<HttpEvent<any>> {
        if(req.headers.get('No-Auth')==='True'){
            return next.handle(req.clone());
        }
        const token = this.userAuthService.getToken();
        req = this.addToken(req, token);
        return next.handle(req).pipe(
            catchError(
                (err:HttpErrorResponse) => {
                    console.log(err.status);
                    if(err.status === 401){
                        this.router.navigate(['/public/connection']);
                    }else if(err.status === 403){
                        this.router.navigate(['/']);
                    }
                    return throwError("Erreur d'Authentification");
                }
            )
        );
    }
    private addToken(request:HttpRequest<any>, token:String){
        return request.clone({
            setHeaders:{
                Autorization : `Bearer ${token}`
            }
               
        });
    }
}