import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  standalone: true,
  template: `
    @if (totalPages > 1) {
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item" [class.disabled]="!hasPrevious">
            <a class="page-link pointer" (click)="goToPage(page - 1)">&laquo;</a>
          </li>
          @for (p of pages; track p) {
            @if (p === -1) {
              <li class="page-item disabled">
                <span class="page-link">&hellip;</span>
              </li>
            } @else {
              <li class="page-item" [class.active]="p === page">
                <a class="page-link pointer" (click)="goToPage(p)">{{ p }}</a>
              </li>
            }
          }
          <li class="page-item" [class.disabled]="!hasNext">
            <a class="page-link pointer" (click)="goToPage(page + 1)">&raquo;</a>
          </li>
        </ul>
      </nav>
    }
  `
})
export class PagerComponent {
  @Input() page: number = 1;
  @Input() pageSize: number = 50;
  @Input() totalItems: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.page;
    const delta = 2;
    const range: number[] = [];

    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }

    const result: number[] = [];
    if (range[0] > 1) {
      result.push(1);
      if (range[0] > 2) result.push(-1);
    }
    result.push(...range);
    if (range[range.length - 1] < total) {
      if (range[range.length - 1] < total - 1) result.push(-1);
      result.push(total);
    }

    return result;
  }

  get hasPrevious(): boolean { return this.page > 1; }
  get hasNext(): boolean { return this.page < this.totalPages; }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages && p !== this.page) {
      this.pageChange.emit(p);
    }
  }
}
