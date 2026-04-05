import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiResponse, emptyResponse, HttpException } from '../models/api.models';
import { firstValueFrom } from 'rxjs';

export class ApiServiceBase {

  protected readonly http = inject(HttpClient);

  protected baseUrl: string = '';

  protected combine(...parts: string[]): string {
    return parts.map(p => p.replace(/^\/+|\/+$/g, '')).filter(p => p).join('/');
  }

  public async post<T>(urlPartial: string, request: any): Promise<any> {
    const response = emptyResponse();
    try {
      return await firstValueFrom(this.http.post<T>(this.combine(this.baseUrl, urlPartial), request));
    } catch (e) {
      response.isSuccess = false;
      const exception = e as HttpException;
      response.message = exception?.error?.data ?? exception?.message ?? 'POST request failed.';
    }
    return response;
  }

  public async get<T>(urlPartial: string): Promise<any> {
    const response = emptyResponse();
    try {
      return await firstValueFrom(this.http.get<T>(this.combine(this.baseUrl, urlPartial)));
    } catch (e) {
      response.isSuccess = false;
      const exception = e as HttpException;
      response.message = exception?.error?.data ?? exception?.message ?? 'GET request failed.';
    }
    return response;
  }

  public async put<T>(urlPartial: string, request: any): Promise<any> {
    const response = emptyResponse();
    try {
      return await firstValueFrom(this.http.put<T>(this.combine(this.baseUrl, urlPartial), request));
    } catch (e) {
      response.isSuccess = false;
      const exception = e as HttpException;
      response.message = exception?.error?.data ?? exception?.message ?? 'PUT request failed.';
    }
    return response;
  }

  public async delete<T>(urlPartial: string, request: any = null): Promise<any> {
    const response = emptyResponse();
    try {
      return await firstValueFrom(this.http.delete<T>(this.combine(this.baseUrl, urlPartial), { body: request }));
    } catch (e) {
      response.isSuccess = false;
      const exception = e as HttpException;
      response.message = exception?.error?.data ?? exception?.message ?? 'DELETE request failed.';
    }
    return response;
  }
}
