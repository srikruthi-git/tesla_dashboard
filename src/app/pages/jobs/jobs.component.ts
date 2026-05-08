import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';

import { JobsService } from '../../core/api/jobs.service';
import { ToastService } from '../../core/ui/toast.service';
import { JobCreateInput, JobRecord, JobStatus, JobUpdateInput } from '../../core/api/jobs.models';
import { DataTableComponent, SortState, TableColumn } from '../../shared/ui/data-table/data-table.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

type JobSortKey =
  | 'id'
  | 'customer'
  | 'installationType'
  | 'status'
  | 'assignedEngineer'
  | 'scheduledDate';

interface StatusFilter {
  label: string;
  value: JobStatus | 'All';
}

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    DataTableComponent,
    PageHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobsComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly jobsService = inject(JobsService);
  private readonly toastService = inject(ToastService);

  readonly jobs = signal<JobRecord[]>([]);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly updatingId = signal<number | null>(null);
  readonly deletingId = signal<number | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly searchQuery = signal('');
  readonly statusFilter = signal<JobStatus | 'All'>('All');

  readonly sortState = signal<SortState>({
    key: 'scheduledDate',
    direction: 'desc'
  });

  readonly page = signal(1);

  readonly pageSize = 6;

  readonly skeletonRows = [0, 1, 2, 3, 4, 5];

  readonly dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'Job ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'installationType', label: 'Installation Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'assignedEngineer', label: 'Assigned Engineer', sortable: true },
    {
      key: 'scheduledDate',
      label: 'Scheduled Date',
      sortable: true,
      align: 'right'
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right'
    }
  ];

  readonly statusFilters: StatusFilter[] = [
    { label: 'All', value: 'All' },
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'On Hold', value: 'On Hold' },
    { label: 'Completed', value: 'Completed' }
  ];

  readonly statusOptions: JobStatus[] = [
    'Scheduled',
    'In Progress',
    'On Hold',
    'Completed'
  ];

  readonly installationTypes = [
    'Solar + Storage',
    'Grid Storage',
    'Solar Retrofit',
    'Microgrid'
  ];

  readonly form = new FormGroup({
    customer: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    installationType: new FormControl(this.installationTypes[0], {
      nonNullable: true,
      validators: [Validators.required]
    }),

    status: new FormControl<JobStatus>('Scheduled', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    assignedEngineer: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    scheduledDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  readonly filteredJobs = computed(() => {

    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();

    return this.jobs().filter((job) => {

      const matchesStatus =
        status === 'All' || job.status === status;

      const haystack =
        `${this.formatJobId(job.id)} ${job.customer} ${job.installationType} ${job.assignedEngineer}`
          .toLowerCase();

      const matchesQuery =
        query.length === 0 || haystack.includes(query);

      return matchesStatus && matchesQuery;
    });
  });

  readonly sortedJobs = computed(() => {

    const sort = this.sortState();

    const data = [...this.filteredJobs()];

    const direction =
      sort.direction === 'asc' ? 1 : -1;

    const statusOrder: Record<JobStatus, number> = {
      Scheduled: 1,
      'In Progress': 2,
      'On Hold': 3,
      Completed: 4
    };

    data.sort((a, b) => {

      switch (sort.key as JobSortKey) {

        case 'id':
          return (a.id - b.id) * direction;

        case 'status':
          return (
            (statusOrder[a.status] - statusOrder[b.status]) *
            direction
          );

        case 'scheduledDate':
          return (
            (new Date(a.scheduledDate).getTime() -
              new Date(b.scheduledDate).getTime()) *
            direction
          );

        default: {

          const key = sort.key as JobSortKey;

          return (
            String(a[key]).localeCompare(String(b[key])) *
            direction
          );
        }
      }
    });

    return data;
  });

  readonly pageCount = computed(() =>
    Math.max(
      1,
      Math.ceil(this.sortedJobs().length / this.pageSize)
    )
  );

  readonly currentPage = computed(() => this.page());

  readonly pageJobs = computed(() => {

    const start =
      (this.currentPage() - 1) * this.pageSize;

    const end = start + this.pageSize;

    return this.sortedJobs().slice(start, end);
  });

  readonly range = computed(() => {

    const total = this.sortedJobs().length;

    if (total === 0) {
      return {
        start: 0,
        end: 0,
        total
      };
    }

    const start =
      (this.currentPage() - 1) * this.pageSize + 1;

    const end =
      Math.min(start + this.pageSize - 1, total);

    return {
      start,
      end,
      total
    };
  });

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {

    this.isLoading.set(true);

    this.errorMessage.set(null);

    this.jobsService
      .list()
      .pipe(

        catchError(() => {

          this.errorMessage.set(
            'Unable to load jobs. Check API connection.'
          );

          this.toastService.show(
            'error',
            'Jobs failed to load',
            'Check backend connection.'
          );

          return of([] as JobRecord[]);
        }),

        finalize(() => this.isLoading.set(false)),

        takeUntilDestroyed(this.destroyRef)

      )
      .subscribe((jobs) => {
        this.jobs.set(jobs);
      });
  }

  onSearch(event: Event): void {

    const target =
      event.target as HTMLInputElement | null;

    this.searchQuery.set(target?.value ?? '');

    this.page.set(1);
  }

  setStatusFilter(
    value: JobStatus | 'All'
  ): void {

    this.statusFilter.set(value);

    this.page.set(1);
  }

  setSort(state: SortState): void {

    this.sortState.set(state);

    this.page.set(1);
  }

  setPage(page: number): void {
    this.page.set(page);
  }

  prevPage(): void {

    this.page.update((value) =>
      Math.max(1, value - 1)
    );
  }

  nextPage(): void {

    this.page.update((value) =>
      Math.min(this.pageCount(), value + 1)
    );
  }

  resetFilters(): void {

    this.searchQuery.set('');

    this.statusFilter.set('All');

    this.page.set(1);
  }

  createJob(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.isSaving.set(true);

    this.errorMessage.set(null);

    const payload = this.toCreatePayload();

    this.jobsService
      .create(payload)
      .pipe(

        finalize(() => this.isSaving.set(false)),

        takeUntilDestroyed(this.destroyRef)

      )
      .subscribe({

        next: (job: JobRecord) => {

          this.jobs.update((value) => [
            job,
            ...value
          ]);

          this.toastService.show(
            'success',
            'Job created',
            `${job.customer} scheduled`
          );

          this.form.reset({
            customer: '',
            installationType: this.installationTypes[0],
            status: 'Scheduled',
            assignedEngineer: '',
            scheduledDate: ''
          });
        },

        error: () => {

          this.errorMessage.set(
            'Unable to create job.'
          );

          this.toastService.show(
            'error',
            'Job creation failed',
            'Please try again.'
          );
        }
      });
  }

  updateStatus(
    job: JobRecord,
    status: JobStatus
  ): void {

    this.updatingId.set(job.id);

    this.errorMessage.set(null);

    const payload: JobUpdateInput = {
      customer: job.customer,
      installationType: job.installationType,
      status,
      assignedEngineer: job.assignedEngineer,
      scheduledDate: job.scheduledDate
    };

    this.jobsService
      .update(job.id, payload)
      .pipe(

        finalize(() =>
          this.updatingId.set(null)
        ),

        takeUntilDestroyed(this.destroyRef)

      )
      .subscribe({

        next: (updated: JobRecord) => {

          this.jobs.update((value) =>
            value.map((item) =>
              item.id === updated.id
                ? updated
                : item
            )
          );

          this.toastService.show(
            'success',
            'Status updated',
            `${updated.customer} is now ${updated.status}`
          );
        },

        error: () => {

          this.errorMessage.set(
            'Unable to update job status.'
          );

          this.toastService.show(
            'error',
            'Status update failed',
            'Please try again.'
          );
        }
      });
  }

  onStatusChange(
    job: JobRecord,
    event: Event
  ): void {

    const target =
      event.target as HTMLSelectElement | null;

    const nextStatus =
      target?.value as JobStatus | undefined;

    if (
      !nextStatus ||
      nextStatus === job.status
    ) {
      return;
    }

    this.updateStatus(job, nextStatus);
  }

  deleteJob(job: JobRecord): void {

    const confirmed = window.confirm(
      `Delete job ${this.formatJobId(job.id)}?`
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(job.id);

    this.errorMessage.set(null);

    this.jobsService
      .remove(job.id)
      .pipe(

        finalize(() =>
          this.deletingId.set(null)
        ),

        takeUntilDestroyed(this.destroyRef)

      )
      .subscribe({

        next: () => {

          this.jobs.update((value) =>
            value.filter(
              (item) => item.id !== job.id
            )
          );

          this.toastService.show(
            'info',
            'Job deleted',
            `${job.customer} removed`
          );
        },

        error: () => {

          this.errorMessage.set(
            'Unable to delete job.'
          );

          this.toastService.show(
            'error',
            'Delete failed',
            'Please try again.'
          );
        }
      });
  }

  formatDate(value: string): string {

    return this.dateFormatter.format(
      new Date(value)
    );
  }

  formatJobId(id: number): string {

    return `J-${id}`;
  }

  private toCreatePayload(): JobCreateInput {

    return {
      customer:
        this.form.controls.customer.value.trim(),

      installationType:
        this.form.controls.installationType.value,

      status:
        this.form.controls.status.value,

      assignedEngineer:
        this.form.controls.assignedEngineer.value.trim(),

      scheduledDate:
        this.form.controls.scheduledDate.value
    };
  }

}