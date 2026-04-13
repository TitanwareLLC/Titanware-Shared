import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({ template: '', standalone: true })
export abstract class BaseComponent implements OnInit {

  public isPageLoading = signal(true);
  public error = signal('');

  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly location = inject(Location);

  public ngOnInit(): void {
    this.initialize().then(() => {
      this.isPageLoading.set(false);
    }).catch((err) => {
      this.error.set(err?.message ?? 'An unexpected error occurred.');
      this.isPageLoading.set(false);
    });
  }

  abstract initialize(): Promise<void>;
}
