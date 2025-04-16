import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../core/_services/course.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {
  formGroup: FormGroup = new FormGroup({});
  course = {
    titre: '',
    description: '',
    courFile: null as File | null
  };
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    // Initialize the form group with validators
    this.formGroup = this.fb.group({
      titre: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.course.courFile = input.files[0];
    }
  }

  onSubmit() {
    if (!this.course.courFile) {
      this.error = 'Please select a PDF file';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    
    // Append JSON object as a string
    

    const formData = new FormData();
    formData.append('cours', JSON.stringify(this.formGroup.value));
    formData.append('courFile', this.course.courFile);
console.log(formData);
    this.courseService.addCourse(formData).subscribe({
      next: () => {
        this.router.navigate(['/admin/admin-dashbord']);
      },
      error: (err) => {
        this.error = 'Failed to add course. Please try again.';
        this.isSubmitting = false;
        console.error('Error adding course:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/admin-dashbord']);
  }
} 