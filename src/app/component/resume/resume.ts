import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from "../../services/resume";

@Component({
  selector: 'app-resume',
  imports: [CommonModule],
  templateUrl: './resume.html',
  styleUrl: './resume.css',
})
export class Resume {
  private readonly resumeService = inject(ResumeService);

  readonly resume = this.resumeService.resume;
  readonly menuOpen = signal(false);
  readonly darkMode = signal(true);

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleTheme(): void {
    this.darkMode.update(value => !value);
  }

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
}
