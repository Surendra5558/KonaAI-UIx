import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlertPopupData {
  title: string;
  message: string;
  okText?: string;
}

export interface AlertPopupResult {
  confirmed: boolean;
}

@Component({
  selector: 'app-alert-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent implements OnInit, OnDestroy {
  @Input() data!: AlertPopupData;
  @Output() result = new EventEmitter<AlertPopupResult>();

  private escapeListener = this.onEscapeKey.bind(this);

  ngOnInit(): void {
    document.addEventListener('keydown', this.escapeListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.escapeListener);
  }

  onEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }

  onClose(): void {
    this.result.emit({ confirmed: true });
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
