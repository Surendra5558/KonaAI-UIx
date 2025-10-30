import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ArchivePopupData {
  title: string;
  message: string;
  itemName?: string;
  confirmText: string;
  cancelText: string;
}

export interface ArchivePopupResult {
  confirmed: boolean;
  data?: ArchivePopupData;
}

@Component({
  selector: 'app-archive-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive-popup.component.html',
  styleUrls: ['./archive-popup.component.scss']
})
export class ArchivePopupComponent implements OnInit, OnDestroy {
  @Input() data!: ArchivePopupData;
  @Output() result = new EventEmitter<ArchivePopupResult>();

  private escapeListener = this.onEscapeKey.bind(this);

  ngOnInit(): void {
    document.addEventListener('keydown', this.escapeListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.escapeListener);
  }

  onEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onCancel();
    }
  }

  onCancel(): void {
    this.result.emit({ confirmed: false });
  }

  onConfirm(): void {
    this.result.emit({ confirmed: true, data: this.data });
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
