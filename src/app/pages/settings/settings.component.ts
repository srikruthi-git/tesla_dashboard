import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

interface SettingItem {
  id: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  readonly settings = signal<SettingItem[]>([
    { id: 'set-1', label: 'Dispatch auto-approval', value: 'Enabled' },
    { id: 'set-2', label: 'Telemetry ingest window', value: '5 minutes' },
    { id: 'set-3', label: 'Market bidding alerts', value: 'Critical only' }
  ]);
}
