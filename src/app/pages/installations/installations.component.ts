import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

interface InstallationItem {
  id: string;
  site: string;
  region: string;
  stage: 'Design' | 'Build' | 'Commissioning';
  eta: string;
}

@Component({
  selector: 'app-installations',
  imports: [PageHeaderComponent],
  templateUrl: './installations.component.html',
  styleUrl: './installations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallationsComponent {
  readonly installations = signal<InstallationItem[]>([
    {
      id: 'inst-1',
      site: 'Mojave Solar Array',
      region: 'Southwest',
      stage: 'Build',
      eta: 'Q3 2026'
    },
    {
      id: 'inst-2',
      site: 'Bay Ridge Storage',
      region: 'West Coast',
      stage: 'Commissioning',
      eta: 'Q2 2026'
    },
    {
      id: 'inst-3',
      site: 'Prairie Wind Hybrid',
      region: 'Midwest',
      stage: 'Design',
      eta: 'Q4 2026'
    }
  ]);
}
