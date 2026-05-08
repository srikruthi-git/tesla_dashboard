import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatCardComponent } from '../../shared/ui/stat-card/stat-card.component';

interface StatItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
}

interface InstallationMetric {
  id: string;
  site: string;
  region: string;
  completion: number;
  status: 'On Track' | 'Watch' | 'At Risk';
}

interface RevenueMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
}

interface JobItem {
  id: string;
  title: string;
  site: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Pending' | 'Completed';
  eta: string;
}

interface TechnicianItem {
  id: string;
  name: string;
  role: string;
  status: 'On Shift' | 'On Call' | 'Off Shift';
}

interface MonthlyStat {
  id: string;
  month: string;
  utilization: number;
  revenue: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [PageHeaderComponent, SectionCardComponent, StatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  readonly stats = signal<StatItem[]>([
    {
      id: 'solar',
      label: 'Solar Output',
      value: '1.8 GW',
      delta: '+4.1% vs yesterday',
      trend: 'up'
    },
    {
      id: 'storage',
      label: 'Battery Reserve',
      value: '72%',
      delta: '-2.4% today',
      trend: 'down'
    },
    {
      id: 'grid',
      label: 'Grid Import',
      value: '320 MW',
      delta: 'Stable',
      trend: 'neutral'
    },
    {
      id: 'sites',
      label: 'Active Sites',
      value: '148',
      delta: '+6 online',
      trend: 'up'
    }
  ]);

  readonly installations = signal<InstallationMetric[]>([
    {
      id: 'inst-1',
      site: 'Mojave Solar Array',
      region: 'Southwest',
      completion: 78,
      status: 'On Track'
    },
    {
      id: 'inst-2',
      site: 'Bay Ridge Storage',
      region: 'West Coast',
      completion: 62,
      status: 'Watch'
    },
    {
      id: 'inst-3',
      site: 'Prairie Wind Hybrid',
      region: 'Midwest',
      completion: 41,
      status: 'At Risk'
    }
  ]);

  readonly revenue = signal<RevenueMetric[]>([
    {
      id: 'rev-1',
      label: 'Market Revenue',
      value: '$42.6M',
      delta: '+6.2% MoM',
      trend: 'up'
    },
    {
      id: 'rev-2',
      label: 'Subscription ARR',
      value: '$18.3M',
      delta: '+3.9% MoM',
      trend: 'up'
    },
    {
      id: 'rev-3',
      label: 'Curtailment Loss',
      value: '$1.2M',
      delta: '-0.6% MoM',
      trend: 'down'
    }
  ]);

  readonly jobs = signal<JobItem[]>([
    {
      id: 'job-501',
      title: 'Inverter firmware audit',
      site: 'North Bay Storage',
      priority: 'Critical',
      status: 'Pending',
      eta: '6 hrs'
    },
    {
      id: 'job-497',
      title: 'Battery thermal inspection',
      site: 'Red Mesa Hub',
      priority: 'High',
      status: 'Pending',
      eta: '12 hrs'
    },
    {
      id: 'job-492',
      title: 'Grid bidding review',
      site: 'Central Plains Wind',
      priority: 'Medium',
      status: 'Completed',
      eta: 'Done'
    },
    {
      id: 'job-488',
      title: 'Telemetry sync recovery',
      site: 'Nevada Solar East',
      priority: 'High',
      status: 'Completed',
      eta: 'Done'
    }
  ]);

  readonly technicians = signal<TechnicianItem[]>([
    { id: 'tech-1', name: 'Avery Ellis', role: 'Field Ops', status: 'On Shift' },
    { id: 'tech-2', name: 'Lana Chen', role: 'Grid Dispatch', status: 'On Call' },
    { id: 'tech-3', name: 'Sanjay Patel', role: 'Storage Ops', status: 'On Shift' },
    { id: 'tech-4', name: 'Maya Ortiz', role: 'Commissioning', status: 'Off Shift' }
  ]);

  readonly monthlyStats = signal<MonthlyStat[]>([
    { id: 'm-jan', month: 'Jan', utilization: 82, revenue: '$9.8M' },
    { id: 'm-feb', month: 'Feb', utilization: 87, revenue: '$10.4M' },
    { id: 'm-mar', month: 'Mar', utilization: 91, revenue: '$11.1M' },
    { id: 'm-apr', month: 'Apr', utilization: 88, revenue: '$10.7M' },
    { id: 'm-may', month: 'May', utilization: 93, revenue: '$12.3M' }
  ]);

  readonly pendingJobs = computed(() => this.jobs().filter((job) => job.status === 'Pending'));
  readonly completedJobs = computed(() => this.jobs().filter((job) => job.status === 'Completed'));
}
