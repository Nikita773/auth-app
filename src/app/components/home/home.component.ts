import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DataTableComponent } from './data-table/data-table.component';
import { MockDataItem } from '../../core/models/mock-api.model';
import { TranslatePipe } from '@ngx-translate/core';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [DataTableComponent, TranslatePipe],
  animations: [
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate('0.5s ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('0.5s ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('moveUp', [
      state('initial', style({ transform: 'translateY(1.5rem)' })),
      state('moved', style({ transform: 'translateY(0)' })),
      transition('initial => moved', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class HomeComponent {
  protected readonly data: WritableSignal<MockDataItem[]> = signal<MockDataItem[]>([]);
  protected readonly showTable: WritableSignal<boolean> = signal(false);
  protected readonly welcomeHidden: WritableSignal<boolean> = signal(false);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  protected readonly fullName: Signal<string> = computed(() => this.auth.user() || '');
  private readonly auth: AuthService = inject(AuthService);
  private readonly http: HttpClient = inject(HttpClient);

  protected handleProceed(): void {
    if (this.loading()) {
      return;
    }

    if (!this.showTable()) {
      setTimeout(() => {
        this.welcomeHidden.set(true);
        this.loadData();
      }, 600);
    } else {
      this.loadData();
    }
  }

  private loadData(): void {
    this.loading.set(true);
    this.http.get<MockDataItem[]>('/data').subscribe((res: MockDataItem[]) => {
      this.data.set(res);
      this.loading.set(false);
      this.showTable.set(true);
    });
  }
}
