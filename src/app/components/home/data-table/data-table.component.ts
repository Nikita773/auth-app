import { Component, InputSignal, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataItem } from '../../../core/models/mock-api.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  public readonly records: InputSignal<MockDataItem[]> = input.required();
}
