import { Component, signal, inject, OnInit, afterNextRender, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimationService } from '../services/animation.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './projects.component.css',
  template: `
<!-- Hero Section -->
<section class="projects-hero py-20 bg-gradient-to-br from-white via-purple-50 to-indigo-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
  <div class="container mx-auto px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="hero-title text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        Featured <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Projects</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        A showcase of my professional work spanning enterprise applications, ERP systems, and innovative web platforms built with modern technologies.
      </p>
      <div class="mt-8 inline-flex items-center bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-6 py-3 rounded-full font-semibold">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        {{getProjectsCount()}}+ Projects Delivered
      </div>
    </div>
  </div>
</section>

<!-- Filter Section -->
<section class="filter-section py-12 bg-white dark:bg-secondary-900">
  <div class="container mx-auto px-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex flex-wrap justify-center gap-4">
        @for (filter of getProjectFilters(); track filter.id) {
          <button 
            (click)="setActiveFilter(filter.id)"
            [class]="'px-6 py-3 rounded-full font-semibold transition-all duration-300 ' + 
                     (activeFilter() === filter.id 
                       ? 'bg-purple-600 text-white shadow-lg' 
                       : 'bg-gray-100 dark:bg-secondary-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900')">
            {{filter.label}}
          </button>
        }
      </div>
    </div>
  </div>
</section>

<!-- Projects Grid -->
<section class="projects-grid-section py-20 bg-gray-50 dark:bg-secondary-800">
  <div class="container mx-auto px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12">
        @for (project of getFilteredProjects(); track project.id) {
          <div class="project-card bg-white dark:bg-secondary-900 rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <!-- Project Image -->
            <div class="relative h-64 bg-gradient-to-br {{project.gradientBg}} overflow-hidden">
              <div class="absolute inset-0 bg-black/20"></div>
              <div class="relative h-full flex items-center justify-center">
                <img [src]="project.image" [alt]="project.title" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              </div>
              <!-- Project Type Badge -->
              <div class="absolute top-4 left-4">
                <span class="bg-white/90 dark:bg-secondary-800/90 backdrop-blur-sm text-gray-800 dark:text-white px-3 py-1 rounded-full text-sm font-medium">
                  {{project.type}}
                </span>
              </div>
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span [class]="'px-3 py-1 rounded-full text-sm font-medium ' + project.statusClass">
                  {{project.status}}
                </span>
              </div>
            </div>

            <!-- Project Content -->
            <div class="p-8">
              <!-- Project Header -->
              <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {{project.title}}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">{{project.client}}</p>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{project.description}}
                </p>
              </div>

              <!-- Key Features -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                  Key Features
                </h4>
                <ul class="space-y-2">
                  @for (feature of project.features; track feature) {
                    <li class="flex items-start space-x-2">
                      <svg class="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span class="text-gray-600 dark:text-gray-300 text-sm">{{feature}}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Technologies -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                  Tech Stack
                </h4>
                <div class="flex flex-wrap gap-2">
                  @for (tech of project.technologies; track tech) {
                    <span class="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-medium">
                      {{tech}}
                    </span>
                  }
                </div>
              </div>

              <!-- Project Stats -->
              @if (project.stats && project.stats.length > 0) {
                <div class="mb-6">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    Project Impact
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    @for (stat of project.stats; track stat.label) {
                      <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{stat.value}}</div>
                        <div class="text-xs text-gray-600 dark:text-gray-400">{{stat.label}}</div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Project Links -->
              <div class="flex flex-wrap gap-3">
                @if (project.liveUrl) {
                  <a [href]="project.liveUrl" target="_blank" 
                     class="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:bg-purple-700 hover:shadow-lg inline-flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    Live Demo
                  </a>
                }
                @if (project.githubUrl) {
                  <a [href]="project.githubUrl" target="_blank" 
                     class="flex-1 border-2 border-purple-600 text-purple-600 px-4 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:bg-purple-600 hover:text-white inline-flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Source Code
                  </a>
                }
                @if (!project.liveUrl && !project.githubUrl) {
                  <div class="w-full bg-gray-100 dark:bg-secondary-800 text-gray-600 dark:text-gray-400 px-4 py-3 rounded-lg font-semibold text-center">
                    <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Confidential Project
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  </div>
</section>

<!-- Call to Action -->
<section class="cta-section py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
  <div class="container mx-auto px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-bold text-white mb-6">
        Ready to Start Your Next Project?
      </h2>
      <p class="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
        Let's collaborate to bring your ideas to life with cutting-edge technology and innovative solutions.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a routerLink="/contact" 
           class="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center">
          <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          Discuss Your Project
        </a>
        
        <a routerLink="/experience" 
           class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:bg-white hover:text-purple-600 hover:scale-105 inline-flex items-center">
          <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
          </svg>
          View Experience
        </a>
      </div>
    </div>
  </div>
</section>
  `
})
export class ProjectsComponent implements OnInit {
  private animationService = inject(AnimationService);
  
  activeFilter = signal('all');

  constructor() {
    afterNextRender(() => {
      this.initializeAnimations();
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  private initializeAnimations(): void {
    // Hero section animations
    this.animationService.fadeIn('.hero-title', { delay: 0.3 });
    
    // Filter animations
    this.animationService.staggerIn('button', { delay: 0.5, stagger: 0.1 });
    
    // Project cards animations
    this.animationService.scrollTriggerAnimation('.project-card', {
      trigger: '.projects-grid-section',
      stagger: 0.2
    });
    
    // CTA section animation
    this.animationService.scrollTriggerAnimation('.cta-section');
  }

  getProjectsCount(): number {
    return this.getAllProjects().length;
  }

  getProjectFilters() {
    return [
      { id: 'all', label: 'All Projects' },
      { id: 'enterprise', label: 'Enterprise' },
      { id: 'web-app', label: 'Web Applications' },
      { id: 'ecommerce', label: 'E-commerce' },
      { id: 'mobile', label: 'Mobile Apps' }
    ];
  }

  setActiveFilter(filterId: string): void {
    this.activeFilter.set(filterId);
  }

  getFilteredProjects() {
    const allProjects = this.getAllProjects();
    const filter = this.activeFilter();
    
    if (filter === 'all') {
      return allProjects;
    }
    
    return allProjects.filter(project => project.category === filter);
  }

  getAllProjects() {
    return [
      {
        id: 1,
        title: "NavYojana ERP System",
        client: "Indian Navy",
        type: "Enterprise ERP",
        category: "enterprise",
        status: "Completed",
        statusClass: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        description: "Comprehensive Enterprise Resource Planning system developed for the Indian Navy to manage personnel, operations, and administrative tasks. Built with modern web technologies to handle complex military workflows.",
        image: "/assets/images/projects/navyojana.svg",
        gradientBg: "from-blue-600 to-navy-800",
        features: [
          "Personnel Management System with hierarchical access control",
          "Multi-module architecture covering HR, Finance, and Operations",
          "Real-time dashboard with advanced analytics and reporting",
          "Role-based authentication and authorization system",
          "Document management and approval workflows",
          "Integration with existing military systems and protocols"
        ],
        technologies: ["Angular", "TypeScript", "Node.js", "MongoDB", "Express.js", "JWT", "Bootstrap", "Chart.js"],
        stats: [
          { label: "Active Users", value: "1000+" },
          { label: "Modules", value: "12" },
          { label: "Data Records", value: "50K+" },
          { label: "Uptime", value: "99.9%" }
        ],
        liveUrl: null,
        githubUrl: null
      },
      {
        id: 2,
        title: "Courtyardly Artist Platform",
        client: "Courtyardly Inc.",
        type: "Creative Platform",
        category: "web-app",
        status: "Completed",
        statusClass: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        description: "Digital platform connecting artists with art enthusiasts, featuring portfolio showcases, commission management, and integrated payment systems. Designed to empower creative professionals.",
        image: "/assets/images/projects/courtyardly.svg",
        gradientBg: "from-purple-600 to-pink-600",
        features: [
          "Artist portfolio management with media galleries",
          "Commission request and project management system",
          "Integrated payment processing with Stripe",
          "Real-time messaging between artists and clients",
          "Advanced search and filtering for artwork discovery",
          "Social features including likes, comments, and follows"
        ],
        technologies: ["Angular", "TypeScript", "Node.js", "MongoDB", "Stripe API", "Socket.io", "Tailwind CSS", "AWS S3"],
        stats: [
          { label: "Artists", value: "500+" },
          { label: "Artworks", value: "5K+" },
          { label: "Commissions", value: "200+" },
          { label: "Countries", value: "25+" }
        ],
        liveUrl: "https://courtyardly.com",
        githubUrl: null
      },
      {
        id: 3,
        title: "MeetWise Scheduling App",
        client: "MeetWise Solutions",
        type: "Productivity App",
        category: "web-app",
        status: "Completed",
        statusClass: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        description: "Smart meeting scheduling application with AI-powered time optimization, calendar integration, and automated reminder systems. Streamlines professional meeting coordination.",
        image: "/assets/images/projects/meetwise.svg",
        gradientBg: "from-green-600 to-teal-600",
        features: [
          "Smart scheduling with conflict detection",
          "Calendar integration (Google, Outlook, Apple)",
          "Automated email and SMS reminders",
          "Video conferencing integration (Zoom, Teams)",
          "Analytics dashboard for meeting insights",
          "Mobile-responsive design for on-the-go access"
        ],
        technologies: ["Angular", "TypeScript", "Python", "Django", "PostgreSQL", "Redis", "Twilio", "Google Calendar API"],
        stats: [
          { label: "Meetings Scheduled", value: "10K+" },
          { label: "Active Users", value: "2K+" },
          { label: "Time Saved", value: "500+ hrs" },
          { label: "Success Rate", value: "98%" }
        ],
        liveUrl: "https://meetwise.app",
        githubUrl: null
      },
      {
        id: 4,
        title: "E-commerce Dashboard",
        client: "Retail Solutions Ltd.",
        type: "Admin Dashboard",
        category: "ecommerce",
        status: "Completed",
        statusClass: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        description: "Comprehensive admin dashboard for e-commerce operations including inventory management, order processing, customer analytics, and sales reporting.",
        image: "/assets/images/projects/ecommerce-dashboard.svg",
        gradientBg: "from-orange-600 to-red-600",
        features: [
          "Real-time inventory tracking and management",
          "Order processing and fulfillment workflows",
          "Customer analytics and segmentation",
          "Sales reporting with advanced charts",
          "Product catalog management",
          "Multi-store support and management"
        ],
        technologies: ["Vue.js", "JavaScript", "Laravel", "MySQL", "Redis", "Chart.js", "Bootstrap", "AWS"],
        stats: [
          { label: "Orders Processed", value: "25K+" },
          { label: "Products Managed", value: "5K+" },
          { label: "Revenue Tracked", value: "$1M+" },
          { label: "Stores", value: "15+" }
        ],
        liveUrl: null,
        githubUrl: null
      },
      {
        id: 5,
        title: "Healthcare Management System",
        client: "Medicalwale",
        type: "Healthcare Platform",
        category: "web-app",
        status: "Completed",
        statusClass: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        description: "Digital healthcare platform enabling patient-doctor interactions, appointment scheduling, medical records management, and telemedicine consultations.",
        image: "/assets/images/projects/healthcare.svg",
        gradientBg: "from-blue-600 to-cyan-600",
        features: [
          "Patient registration and profile management",
          "Doctor dashboard with appointment scheduling",
          "Electronic health records (EHR) system",
          "Video consultation integration",
          "Prescription management and e-prescriptions",
          "Payment integration for consultation fees"
        ],
        technologies: ["Angular", "TypeScript", "Node.js", "MongoDB", "WebRTC", "Socket.io", "Stripe", "Bootstrap"],
        stats: [
          { label: "Patients", value: "3K+" },
          { label: "Doctors", value: "150+" },
          { label: "Consultations", value: "8K+" },
          { label: "Prescriptions", value: "5K+" }
        ],
        liveUrl: null,
        githubUrl: null
      },
      {
        id: 6,
        title: "Mobile Banking App",
        client: "FinTech Innovations",
        type: "Mobile Application",
        category: "mobile",
        status: "In Development",
        statusClass: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
        description: "Secure mobile banking application with modern UI/UX, featuring account management, fund transfers, bill payments, and investment tracking.",
        image: "/assets/images/projects/mobile-banking.svg",
        gradientBg: "from-indigo-600 to-purple-600",
        features: [
          "Secure biometric authentication",
          "Real-time account balance and transaction history",
          "Instant fund transfers and bill payments",
          "Investment portfolio tracking",
          "Expense categorization and budgeting tools",
          "Push notifications for important updates"
        ],
        technologies: ["React Native", "TypeScript", "Node.js", "PostgreSQL", "Redux", "Firebase", "Plaid API"],
        stats: [
          { label: "Beta Users", value: "500+" },
          { label: "Transactions", value: "2K+" },
          { label: "Security Score", value: "A+" },
          { label: "App Rating", value: "4.8" }
        ],
        liveUrl: null,
        githubUrl: null
      }
    ];
  }
}