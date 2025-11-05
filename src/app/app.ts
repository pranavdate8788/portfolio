import { Component, signal, inject, OnInit, afterNextRender } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { AnimationService } from './services/animation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly animationService = inject(AnimationService);
  
  protected readonly title = signal('Pranav Date');
  protected readonly subtitle = signal('Full Stack Developer & UI/UX Designer');
  protected readonly mobileMenuOpen = signal(false);
  protected readonly currentTheme = this.themeService.currentTheme;
  protected readonly isDarkMode = this.themeService.isDarkMode;

  constructor() {
    afterNextRender(() => {
      this.initializeAnimations();
    });
  }

  ngOnInit(): void {
    // Initialize theme
    this.themeService.setTheme(this.themeService.currentTheme());
    
    // Show loading animation on initial load
    if (typeof window !== 'undefined') {
      this.animationService.pageLoadAnimation();
    }
  }

  private initializeAnimations(): void {
    // Animate header on load
    this.animationService.fadeIn('header', { delay: 0.2 });
    this.animationService.slideInLeft('.logo', { delay: 0.3 });
    this.animationService.slideInRight('.nav-links', { delay: 0.4 });
    
    // Add hover effects to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      this.animationService.hoverScale(link as HTMLElement);
    });
  }
  
  protected toggleMobileMenu(): void {
    const isOpen = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(isOpen);
    
    const menuElement = document.querySelector('.mobile-menu') as HTMLElement;
    if (menuElement) {
      this.animationService.animateNavMenu(isOpen, menuElement);
    }
  }
  
  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    
    const menuElement = document.querySelector('.mobile-menu') as HTMLElement;
    if (menuElement) {
      this.animationService.animateNavMenu(false, menuElement);
    }
  }
  
  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  protected currentYear(): number {
    return new Date().getFullYear();
  }

  protected getNavLinks() {
    return [
      { path: '/home', label: 'Home', icon: '🏠' },
      { path: '/about', label: 'About', icon: '👨‍💻' },
      { path: '/skills', label: 'Skills', icon: '⚡' },
      { path: '/projects', label: 'Projects', icon: '💼' },
      { path: '/experience', label: 'Experience', icon: '🌟' },
      { path: '/contact', label: 'Contact', icon: '📞' }
    ];
  }
}
