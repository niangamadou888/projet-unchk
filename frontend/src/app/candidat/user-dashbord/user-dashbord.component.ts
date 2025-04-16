import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnnonceService } from '../../core/_services/annonce.service';
import { CommonModule } from '@angular/common';
import { CourseService, Course } from '../../core/_services/course.service';
import { UserAuthService } from '../../core/_services/user-auth.service';

@Component({
  selector: 'app-user-dashbord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashbord.component.html',
  styleUrl: './user-dashbord.component.css'
})
export class UserDashbordComponent {
  annonces: any[] = [];
  courses: Course[] = [];
  isLoading = true;
  error: string | null = null;
  downloadingFile: number | null = null;
  viewingFile: number | null = null;
  
  // New navbar properties
  activeTab = 'cours';
  userName = 'Étudiant';
  notificationCount = 2;
  showProfileMenu = false;

  constructor(
    private router: Router,
    private annonceService: AnnonceService,
    private courseService: CourseService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    // Load annonces
    this.annonceService.getAnnonces().subscribe((data) => {
      this.annonces = data;
      console.log(this.annonces);
    });
    
    // Load courses
    this.loadCourses();
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

  // New navbar methods
  setActiveTab(tab: string) {
    this.activeTab = tab;
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

  chooseCompte() {
    this.router.navigate(['/candidat/compte']);
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

  downloadFile(courseId: number) {
    this.downloadingFile = courseId;
    this.courseService.downloadFile(courseId).subscribe({
      next: (blob) => {
        this.handleFileResponse(blob, courseId, 'download');
        this.downloadingFile = null;
      },
      error: (err) => {
        console.error('Error downloading file:', err);
        alert('Échec du téléchargement du fichier. Veuillez réessayer.');
        this.downloadingFile = null;
      }
    });
  }

  viewFile(courseId: number) {
    this.viewingFile = courseId;
    this.courseService.downloadFile(courseId).subscribe({
      next: (blob) => {
        this.handleFileResponse(blob, courseId, 'view');
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
