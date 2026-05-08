import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { StatCardComponent } from '../../shared/ui/stat-card/stat-card.component';

interface InsightItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [PageHeaderComponent, StatCardComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent {
  readonly insights = signal<InsightItem[]>([
    {
      id: 'forecast',
      label: 'Forecast Accuracy',
      value: '94.2%',
      delta: '+1.8% WoW',
      trend: 'up'
    },
    {
      id: 'dispatch',
      label: 'Dispatch Latency',
      value: '1.4 min',
      delta: '-0.3 min',
      trend: 'up'
    },
    {
      id: 'deviations',
      label: 'Market Deviations',
      value: '6',
      delta: 'Stable',
      trend: 'neutral'
    }
  ]);
}
