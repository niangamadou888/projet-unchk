import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service'; 

export const authGuard: CanActivateFn = (route, state) => {
  const userAuthService = inject(UserAuthService);
  const router = inject(Router);
  const userService = inject(UserService);

  const token = userAuthService.getToken(); // Récupération du token

  if (token !== null){
    const roles = route.data["roles"] as Array <string>;
    
    if(roles){
      const match = userService.roleMatch(roles);
      if(match){
        return true;
      }else{
        router.createUrlTree(['/']);
        return false;
      } 
    }
    router.createUrlTree(['/public/connection']);
    return false;
  }
  return router.createUrlTree(['/']);
};
