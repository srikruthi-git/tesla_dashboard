import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly delta = input<string>();
  readonly trend = input<'up' | 'down' | 'neutral'>('neutral');

  readonly trendLabel = computed(() => {
    const trend = this.trend();

    if (trend === 'up') {
      return 'Up';
    }

    if (trend === 'down') {
      return 'Down';
    }

    return 'Stable';
  });
}
