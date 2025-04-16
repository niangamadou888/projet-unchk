import { Routes } from '@angular/router';

// Layouts
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { CandidatLayoutComponent } from './layouts/candidat-layout/candidat-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

// Pages Public (accessible à tous)
import { HomeComponent } from './public/home/home.component';
import { ConnectionComponent } from './public/connection/connection.component';
import { FormComponent } from './public/form/form.component';

// Pages Candidat
import { UserDashbordComponent } from './candidat/user-dashbord/user-dashbord.component';

// Pages Admin
import { AdminDashbordComponent } from './admin/admin-dashbord/admin-dashbord.component';
import { CompteComponent } from './candidat/compte/compte.component';
import { authGuard } from './core/_auth/auth.guard';
import { NotAuthorizedComponent } from './shared/components/not-authorized/not-authorized.component';
import { AddCourseComponent } from './admin/add-course/add-course.component';

export const routes: Routes = [
  // Layout Public
  {
    path: '', component: PublicLayoutComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'connexion', component: ConnectionComponent },
      { path: 'inscription', component: FormComponent },
      { path: 'notAuthorized', component: NotAuthorizedComponent }
    ]
  },

  // Layout Candidat
  {
    path: 'candidat', component: CandidatLayoutComponent, children: [
      { path: 'userDashbord', component: UserDashbordComponent, canActivate: [authGuard], data:{roles:['User']} },
      { path: 'compte' , component: CompteComponent}
    ]
  },

  // Layout Admin
  {
    path: 'admin', component: AdminLayoutComponent, children: [
      { path: 'admin-dashbord', component: AdminDashbordComponent, canActivate:[authGuard], data:{roles:['Admin']} },
      { path: 'add-course', component: AddCourseComponent, canActivate:[authGuard], data:{roles:['Admin']} }
    ]
  },

  // Redirection si la route n'existe pas
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
