import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-insight',
  standalone: true,
  imports: [
    FormsModule, CommonModule
  ],
  templateUrl: './insght.component.html',
  styleUrls: ['./insght.component.scss']
})
export class InsightsComponent {
  activeInsightsMenu: string | null='';
  activeTab = 'insights';
   downloadInsightCard(key: string): void {
    console.log('Downloading insight card:', key);
    // Logic to trigger file download or generate a report
  }
   previewInsightCard(key: string): void {
    console.log('Previewing insight card:', key);
    this.activeInsightsMenu = key;
    // Logic to preview the insight card (e.g. open dialog or toggle content)
  }
  toggleInsightsMenu(event: MouseEvent, menuId: string) {
  event.stopPropagation(); // prevent body click from closing immediately
  if (this.activeInsightsMenu === menuId) {
    this.activeInsightsMenu = null; // close if already open
  } else {
    this.activeInsightsMenu = menuId; // open selected menu
  }
}
}

