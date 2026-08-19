import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResumeData } from '../models/resume-model';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private readonly http = inject(HttpClient);

  readonly resume = signal<ResumeData>({
    personal: {
      name: '',
      shortName: '',
      title: '',
      location: '',
      email: '',
      github: '',
      linkedin: '',
      resumeUrl: '',
      summary: '',
      availability: '',
    },

    experience: [],

    skills: [],

    projects: [],

    education: [],
  });

  constructor() {
    this.loadResumeData();
  }

  private loadResumeData(): void {
    this.http.get<ResumeData>('assets/data/resume.json').subscribe({
      next: (data) => {
        this.resume.set(data);
      },

      error: (err) => {
        console.error('Failed to load resume data:', err);
      },
    });
  }
}
