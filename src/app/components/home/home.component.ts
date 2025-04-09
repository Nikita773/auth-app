import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { DataTableComponent } from './data-table/data-table.component';
import { MockDataItem } from '../../core/models/mock-api.model';
import { TranslatePipe } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MockDataApiService } from '../../core/services/mock-data-api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [DataTableComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate('0.5s ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('0.5s ease-out', style({ opacity: 0, 'margin-bottom': 0, height: 0 }))]),
    ]),
  ],
})
export class HomeComponent {
  protected readonly data: WritableSignal<MockDataItem[]> = signal<MockDataItem[]>([]);
  protected readonly showWelcome: WritableSignal<boolean> = signal(true);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  protected readonly showTable: Signal<boolean> = computed(() => !this.showWelcome());
  protected readonly fullName: Signal<string> = computed(() => this.auth.user()?.fullName || '');
  private readonly auth: AuthService = inject(AuthService);
  private readonly mockDataApiService: MockDataApiService = inject(MockDataApiService);

  protected handleProceed(): void {
    if (this.loading()) {
      return;
    }

    this.loadData();
    this.showWelcome.set(false);
  }

  private loadData(): void {
    this.loading.set(true);

    this.mockDataApiService
      .getMockDataItems()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res: MockDataItem[]) => this.data.set(res));
  }
}
