import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help',
  imports: [CommonModule, FormsModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
   @Input() isCollapsed!: boolean;
  show = false;
  questionText: string = '';
  fileSelected: File | null = null;

  open() { this.show = true; }
  close() { this.show = false; }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileSelected = input.files[0];
    } else {
      this.fileSelected = null;
    }
  }
  get canSubmit(): boolean {
    return !!this.questionText.trim() || !!this.fileSelected;
  }

  submit() {
    if (this.canSubmit) {
      // Handle submit logic here
      console.log('Submitted:', this.questionText, this.fileSelected);
    }
  }

  // Prevent closing on ESC and clicks outside
  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: Event) {
    if (this.show) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

}
