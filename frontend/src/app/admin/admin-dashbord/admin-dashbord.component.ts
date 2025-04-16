import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../core/_services/user-auth.service';
import { Router } from '@angular/router';
import { CourseService, Course } from '../../core/_services/course.service';

@Component({
  selector: 'app-admin-dashbord',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashbord.component.html',
  styleUrl: './admin-dashbord.component.css'
})
export class AdminDashbordComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;
  error: string | null = null;
  downloadingFile: number | null = null;
  viewingFile: number | null = null;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit() {
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
        this.error = 'Failed to load courses. Please try again later.';
        this.isLoading = false;
        console.error('Error loading courses:', err);
      }
    });
  }

  logout() {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }

  addCourse() {
    this.router.navigate(['/admin/add-course']);
  }

  deleteCourse(courseId: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.courses = this.courses.filter(course => course.id !== courseId);
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          alert('Failed to delete course. Please try again.');
        }
      });
    }
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
        alert('Failed to download file. Please try again.');
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
        alert('Failed to view file. Please try again.');
        this.viewingFile = null;
      }
    });
  }
}
