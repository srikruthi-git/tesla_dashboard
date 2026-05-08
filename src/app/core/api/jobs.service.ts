import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from './api.config';
import {
  JobApi,
  JobCreateInput,
  JobCreateRequest,
  JobRecord,
  JobUpdateInput,
  JobUpdateRequest
} from './jobs.models';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  list(): Observable<JobRecord[]> {
    return this.http.get<JobApi[]>(`${this.baseUrl}/jobs`).pipe(map((jobs) => jobs.map((job) => this.fromApi(job))));
  }

  create(payload: JobCreateInput): Observable<JobRecord> {
    return this.http
      .post<JobApi>(`${this.baseUrl}/jobs`, this.toCreateRequest(payload))
      .pipe(map((job) => this.fromApi(job)));
  }

  update(jobId: number, payload: JobUpdateInput): Observable<JobRecord> {
    return this.http
      .put<JobApi>(`${this.baseUrl}/jobs/${jobId}`, this.toUpdateRequest(payload))
      .pipe(map((job) => this.fromApi(job)));
  }

  remove(jobId: number): Observable<void> {
    return this.http.delete(`${this.baseUrl}/jobs/${jobId}`).pipe(map(() => undefined));
  }

  private fromApi(job: JobApi): JobRecord {
    return {
      id: job.id,
      customer: job.customer,
      installationType: job.installation_type,
      status: job.status,
      assignedEngineer: job.assigned_engineer,
      scheduledDate: job.scheduled_date
    };
  }

  private toCreateRequest(payload: JobCreateInput): JobCreateRequest {
    return {
      customer: payload.customer,
      installation_type: payload.installationType,
      status: payload.status,
      assigned_engineer: payload.assignedEngineer,
      scheduled_date: payload.scheduledDate
    };
  }

  private toUpdateRequest(payload: JobUpdateInput): JobUpdateRequest {
    return this.toCreateRequest(payload);
  }
}
