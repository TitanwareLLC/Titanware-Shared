
export interface ApiResponse<T = any> {
  name: string;
  statusCode: string;
  isSuccess: boolean;
  message: string;
  data: T;
}

export function emptyResponse<T = any>(): ApiResponse<T> {
  return { name: '', statusCode: '', isSuccess: false, message: '', data: undefined as any };
}

export interface Status {
  inProgress: boolean;
  data: any;
  current: number;
  total: number;
  percentageCompleted: number;
  secondsCompleted: number;
  percentageRemaining: number;
  secondsRemaining: number;
}

export interface HttpException {
  error: any;
  headers: any;
  message: string;
  name: string;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
}
