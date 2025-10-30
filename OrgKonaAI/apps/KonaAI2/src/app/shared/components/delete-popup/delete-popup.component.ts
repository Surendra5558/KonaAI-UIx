import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DeletePopupData {
  title: string;
  message: string;
  itemName?: string;
  confirmText: string;
  cancelText: string;
}

export interface DeletePopupResult {
  confirmed: boolean;
  data?: DeletePopupData;
}

@Component({
  selector: 'app-delete-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit, OnDestroy {
  @Input() data!: DeletePopupData;
  @Output() result = new EventEmitter<DeletePopupResult>();

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
