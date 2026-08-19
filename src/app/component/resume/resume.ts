import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume';

@Component({
  selector: 'app-resume',
  imports: [CommonModule],
  templateUrl: './resume.html',
  styleUrl: './resume.css',
})
export class Resume implements AfterViewInit, OnDestroy {
  private readonly resumeService = inject(ResumeService);

  readonly resume = this.resumeService.resume;
  readonly menuOpen = signal(false);
  readonly darkMode = signal(true);
  readonly activeSection = signal('home');
  readonly scrollProgress = signal(0);
  readonly typedRole = signal('');
  readonly currentYear = new Date().getFullYear();

  private revealObserver?: IntersectionObserver;
  private sectionObserver?: IntersectionObserver;
  private typingTimer?: ReturnType<typeof setTimeout>;
  private destroyed = false;

  private readonly roles = [
    'enterprise applications',
    'Java & Spring solutions',
    'Angular interfaces',
    'web applications',
  ];

  constructor() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('resume-theme') === 'light') {
      this.darkMode.set(false);
    }
  }

  ngAfterViewInit(): void {
    this.setupRevealObserver();
    this.setupSectionObserver();
    this.startTypingAnimation();
    this.updateScrollProgress();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.revealObserver?.disconnect();
    this.sectionObserver?.disconnect();

    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrollProgress();
  }

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleTheme(): void {
    this.darkMode.update(value => !value);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('resume-theme', this.darkMode() ? 'dark' : 'light');
    }
  }

  scrollTo(id: string): void {
    this.closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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

  private updateScrollProgress(): void {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
    this.scrollProgress.set(Math.min(100, Math.max(0, progress)));
  }

  private setupRevealObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -55px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(element => {
      this.revealObserver?.observe(element);
    });
  }

  private setupSectionObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.sectionObserver = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          this.activeSection.set(visible.target.id);
        }
      },
      {
        threshold: [0.15, 0.3, 0.5],
        rootMargin: '-12% 0px -58% 0px',
      }
    );

    document.querySelectorAll('main section[id]').forEach(section => {
      this.sectionObserver?.observe(section);
    });
  }

  private startTypingAnimation(): void {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      this.typedRole.set(this.roles[0]);
      return;
    }

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const tick = () => {
      if (this.destroyed) {
        return;
      }

      const role = this.roles[roleIndex];
      characterIndex += deleting ? -1 : 1;
      this.typedRole.set(role.slice(0, characterIndex));

      let delay = deleting ? 42 : 72;

      if (!deleting && characterIndex === role.length) {
        deleting = true;
        delay = 1400;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % this.roles.length;
        delay = 300;
      }

      this.typingTimer = setTimeout(tick, delay);
    };

    tick();
  }
}
