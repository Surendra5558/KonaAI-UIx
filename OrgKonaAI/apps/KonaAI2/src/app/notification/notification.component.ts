import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
   @Input() isCollapsed!: boolean;
  activeTab: string = 'View All';
  isOpen = false;
  selectedView: 'organisation' | 'projects' = 'projects';

  isopens() { this.isOpen = true; }

  close() { this.isOpen = false; }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  setView(view: 'organisation' | 'projects') {
    this.selectedView = view;
  }

  // Prevent closing on ESC key to mimic keyboard: false
  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: Event) {
    if (this.isOpen) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
