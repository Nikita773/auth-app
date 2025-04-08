import {
  Component,
  InputSignal,
  input,
  signal,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataItem } from '../../../core/models/mock-api.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements AfterViewInit, OnDestroy {
  public readonly records: InputSignal<MockDataItem[]> = input.required();
  protected readonly visibleRecords: WritableSignal<MockDataItem[]> = signal<MockDataItem[]>([]);
  private readonly batchSize: WritableSignal<number> = signal(100);
  private readonly currentIndex: WritableSignal<number> = signal(0);

  @ViewChild('loadTrigger') triggerRef!: ElementRef;
  private observer!: IntersectionObserver;

  public ngAfterViewInit(): void {
    this.visibleRecords.set(this.records().slice(0, this.batchSize()));
    this.currentIndex.set(this.batchSize());
    this.initObserver();
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private initObserver(): void {
    this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        this.loadMore();
      }
    });

    if (this.triggerRef?.nativeElement) {
      this.observer.observe(this.triggerRef.nativeElement);
    }
  }

  private loadMore(): void {
    const batchSize: number = this.batchSize();
    const currentIndex: number = this.currentIndex();

    const next: MockDataItem[] = this.records().slice(currentIndex, currentIndex + batchSize);
    if (next.length) {
      const combined: MockDataItem[] = [...this.visibleRecords(), ...next];
      this.visibleRecords.set(combined);
      this.currentIndex.set(currentIndex + batchSize);
    }
  }
}
