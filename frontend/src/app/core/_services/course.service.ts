import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';

export interface Course {
  id?: number;
  titre: string;
  description: string;
  courFile?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `http://localhost:8080/api/cours`;

  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.userAuthService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all courses
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Add a new course with PDF file
  addCourse(courseData: FormData): Observable<Course> {
    const headers = this.getHeaders();
    return this.http.post<Course>(`${this.apiUrl}/soumettre`, courseData, { headers });
  }

  // Delete a course
  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}`, { headers: this.getHeaders() });
  }

  // Download course file
  downloadFile(courseId: number): Observable<Blob> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/download/courFile/${courseId}`, {
      headers: headers,
      responseType: 'blob'
    });
  }
} 