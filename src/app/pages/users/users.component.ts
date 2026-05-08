import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

interface UserItem {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'On Call' | 'Offline';
}

@Component({
  selector: 'app-users',
  imports: [PageHeaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
  readonly users = signal<UserItem[]>([
    { id: 'user-1', name: 'Avery Ellis', role: 'Ops Lead', status: 'Active' },
    { id: 'user-2', name: 'Lana Chen', role: 'Dispatch', status: 'On Call' },
    { id: 'user-3', name: 'Sanjay Patel', role: 'Field Ops', status: 'Active' }
  ]);
}
