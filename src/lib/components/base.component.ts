import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({ template: '', standalone: true })
export abstract class BaseComponent implements OnInit {

  public isPageLoading: boolean = true;
  public error: string = '';

  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly location = inject(Location);
  protected readonly cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.initialize().then(() => {
      this.isPageLoading = false;
      this.cdr.markForCheck();
    }).catch((err) => {
      this.error = err?.message ?? 'An unexpected error occurred.';
      this.isPageLoading = false;
      this.cdr.markForCheck();
    });
  }

  abstract initialize(): Promise<void>;
}
