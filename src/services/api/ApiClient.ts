export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiClient {
  constructor(private baseURL: string, private defaultHeaders: Record<string,string> = {}) {}

  async request<T>(path: string, method: HttpMethod = 'GET', body?: any, headers: Record<string,string> = {}): Promise<T> {
    const url = this.baseURL.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
    const ctrl = new AbortController();
    const isJson = body && !(body instanceof FormData);
    const h = { 'Accept': 'application/json', ...this.defaultHeaders, ...headers, ...(isJson ? { 'Content-Type': 'application/json' } : {}) };

    const res = await fetch(url, {
      method, headers: h, body: isJson ? JSON.stringify(body) : body, signal: ctrl.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
    }
    const ct = res.headers.get('content-type') || '';
    return (ct.includes('application/json') ? await res.json() : (await res.text())) as T;
  }

  get<T>(p: string, h?: Record<string,string>) { return this.request<T>(p, 'GET', undefined, h); }
  post<T>(p: string, b?: any, h?: Record<string,string>) { return this.request<T>(p, 'POST', b, h); }
  put<T>(p: string, b?: any, h?: Record<string,string>) { return this.request<T>(p, 'PUT', b, h); }
  patch<T>(p: string, b?: any, h?: Record<string,string>) { return this.request<T>(p, 'PATCH', b, h); }
  delete<T>(p: string, h?: Record<string,string>) { return this.request<T>(p, 'DELETE', undefined, h); }
}
