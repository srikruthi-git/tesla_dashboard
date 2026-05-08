import { Routes } from '@angular/router';

import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
	},
	{
		path: '',
		component: ShellComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
			{
				path: 'dashboard',
				loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
			},
			{
				path: 'jobs',
				loadComponent: () => import('./pages/jobs/jobs.component').then((m) => m.JobsComponent)
			},
			{
				path: 'analytics',
				loadComponent: () => import('./pages/analytics/analytics.component').then((m) => m.AnalyticsComponent)
			},
			{
				path: 'settings',
				loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent)
			}
		]
	},
	{ path: '**', redirectTo: 'dashboard' }
];
