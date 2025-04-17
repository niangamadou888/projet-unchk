import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AnnonceService } from '../../core/_services/annonce.service'; // Removed for now
import { CommonModule } from '@angular/common';
import { CourseService, Course } from '../../core/_services/course.service';
import { UserAuthService } from '../../core/_services/user-auth.service';
import { UserAccountComponent } from "../user-account/user-account.component";
import { UserService } from '../../core/_services/user.service';

@Component({
  selector: 'app-user-dashbord',
  standalone: true,
  imports: [CommonModule, UserAccountComponent],
  templateUrl: './user-dashbord.component.html',
  styleUrl: './user-dashbord.component.css'
})
export class UserDashbordComponent implements OnInit {
  annonces: any[] = []; // Kept for potential future use
  courses: Course[] = [];
  isLoading = true;
  isUserInfoLoading = true; // Add a flag for user info loading
  error: string | null = null;
  downloadingFile: string | null = null;
  viewingFile: string | null = null;
  
  // New navbar properties
  activeTab: string = 'cours';
  userName: string = 'Étudiant'; // Default username
  notificationCount: number = 2;
  showProfileMenu: boolean = false;
  showAccountSection: boolean = false;

  constructor(
    private router: Router,
    // private annonceService: AnnonceService, // Removed for now
    private courseService: CourseService,
    private userAuthService: UserAuthService,
    private userService: UserService // Inject UserService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadUserInfo();
    // this.annonceService.getAnnonces().subscribe((data) => { // Removed for now
    //   this.annonces = data;
    //   console.log(this.annonces);
    // });
  }

  loadUserInfo(): void {
    const token = this.userAuthService.getToken();
    if (token) {
      this.isUserInfoLoading = true;
      this.userService.getUserInfo(token).subscribe({
        next: (data: { userFirstName: string; userLastName: string }) => {
          this.userName = `${data.userFirstName} ${data.userLastName}`;
          this.isUserInfoLoading = false;
        },
        error: (err) => {
          console.error('Error loading user info:', err);
          this.userName = 'Étudiant'; // Fallback to default
          this.isUserInfoLoading = false;
        }
      });
    } else {
      this.isUserInfoLoading = false; // No token, stop loading
    }
  }

  loadCourses() {
    this.isLoading = true;
    this.error = null;
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger les cours. Veuillez réessayer plus tard.';
        this.isLoading = false;
        console.error('Error loading courses:', err);
      }
    });
  }

  getCourseImageUrl(course: Course): string {
    const titleLower = course.titre.toLowerCase();
    if (titleLower.includes('informatique')) {
      return '../assets/image/informatique.jpg';
    } else if (titleLower.includes('IA')) {
      return '../assets/image/IA.jpg';
    }else if (titleLower.includes('Reseau')) {
      return '../assets/image/Reseau.jpg';
    }else if (titleLower.includes('Big Data')) {
      return '../assets/image/big-data.jpg';
    }else if (titleLower.includes('comptabilite')) {
      return '../assets/image/compta.jpg';
    }else if (titleLower.includes('mathematique')) {
      return '../assets/image/math.jpg';
    }else if (titleLower.includes('sociologie')) {
      return '../assets/image/socio.png';
    }
    // Add more conditions here for other keywords if needed
    // else if (titleLower.includes('mathématiques')) {
    //   return '../assets/image/mathematiques.jpg';
    // }
    return '../assets/image/course-default.jpg'; // Default image
  }

  // New navbar methods
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.showAccountSection = (tab === 'compte');
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  choosePostuler() {
    this.router.navigate(['/candidat/form-candidature']);
  }
  
  chooseCandidature() {
    this.router.navigate(['/candidat/candidature']);
  }

  chooseCompte() { // Added missing method
    this.setActiveTab('compte');
  }
  
  goToForum() {
    this.router.navigate(['/candidat/forum']);
  }
  
  logout() {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }

  private handleFileResponse(blob: Blob, courseId: number, action: 'download' | 'view') {
    const url = window.URL.createObjectURL(blob);
    
    if (action === 'download') {
      // Create a link element for download
      const link = document.createElement('a');
      link.href = url;
      link.download = `course-${courseId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Open in new tab for viewing
      window.open(url, '_blank');
    }
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
  }

  downloadFile(courseId: string) {
    this.downloadingFile = courseId;
    this.courseService.downloadFile(parseInt(courseId)).subscribe({
      next: (blob) => {
        this.handleFileResponse(blob, parseInt(courseId), 'download');
        this.downloadingFile = null;
      },
      error: (err) => {
        console.error('Error downloading file:', err);
        alert('Échec du téléchargement du fichier. Veuillez réessayer.');
        this.downloadingFile = null;
      }
    });
  }

  viewFile(courseId: string) {
    this.viewingFile = courseId;
    this.courseService.downloadFile(parseInt(courseId)).subscribe({
      next: (blob) => {
        this.handleFileResponse(blob, parseInt(courseId), 'view');
        this.viewingFile = null;
      },
      error: (err) => {
        console.error('Error viewing file:', err);
        alert('Échec de l\'ouverture du fichier. Veuillez réessayer.');
        this.viewingFile = null;
      }
    });
  }
}
