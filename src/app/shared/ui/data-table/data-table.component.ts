import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
  readonly columns = input.required<TableColumn[]>();
  readonly sortState = input<SortState | null>(null);
  readonly layout = input<string>('1fr 1fr');

  readonly sortChange = output<SortState>();

  toggleSort(column: TableColumn): void {
    if (!column.sortable) {
      return;
    }

    const current = this.sortState();
    const direction = current?.key === column.key && current.direction === 'asc' ? 'desc' : 'asc';

    this.sortChange.emit({ key: column.key, direction });
  }

  getAriaSort(column: TableColumn): string | null {
    const current = this.sortState();

    if (!column.sortable || !current || current.key !== column.key) {
      return null;
    }

    return current.direction === 'asc' ? 'ascending' : 'descending';
  }
}
