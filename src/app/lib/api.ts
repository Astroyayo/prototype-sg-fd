import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { apiEndPoint } from '@/app/config/constants';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface ApiRequest {
  method: HttpMethod;
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  status: boolean;
  http_status_code: number;
  data: T;
}

class ApiClass {
  private readonly _axios: AxiosInstance;
  private readonly requests: any[] = [];

  constructor() {
    this._axios = axios.create({
      baseURL: apiEndPoint || '',
      headers: {},
    });
  }

  set Authorization(token: string) {
    this._axios.defaults.headers['Authorization'] = token;
  }

  set baseUrl(url: string) {
    this._axios.defaults.baseURL = url;
  }

  get baseURL(): string {
    return this._axios.defaults.baseURL || '';
  }

  async makeRequest<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
    const { method, url, data, headers = {} } = request;

    const config: AxiosRequestConfig = {
      headers,
    };

    const reqPromise = this._axios[method](url, data, config).then((res) => ({
      status: true,
      http_status_code: res.status,
      data: res.data,
    })).catch((error: AxiosError) => {
      const httpStatus = error.response?.status ?? 0;
      const responseData = (error.response?.data ?? {}) as T;

      if (error.code === 'ERR_NETWORK') {
        return {
          status: false,
          http_status_code: 0,
          data: {} as T,
        };
      }

      return {
        status: false,
        http_status_code: httpStatus,
        data: responseData,
      };
    });

    this.requests.push({ url: `${method}:${url}`, axios: reqPromise });

    return reqPromise;
  }

  get<T = any>(url: string, data?: any) {
    return this.makeRequest<T>({ method: 'get', url, data });
  }

  post<T = any>(url: string, data?: any, headers?: Record<string, string>) {
    return this.makeRequest<T>({ method: 'post', url, data, headers });
  }

  put<T = any>(url: string, data?: any, headers?: Record<string, string>) {
    return this.makeRequest<T>({ method: 'put', url, data, headers });
  }

  delete<T = any>(url: string, data?: any) {
    return this.makeRequest<T>({ method: 'delete', url, data: { data } });
  }

  patch<T = any>(url: string, data?: any) {
    return this.makeRequest<T>({ method: 'patch', url, data });
  }
}

const api = new ApiClass();
export default api;
