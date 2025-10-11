import type { NitroFetchRequest, $Fetch } from 'nitropack';

type ApiClient = $Fetch<unknown, NitroFetchRequest>

export function createBasicApi(api: ApiClient) {
  const req = <T = unknown>(url: string, opts: any) =>
    api<T>(url as any, opts as any);

  return {
    get<T = unknown>(url: string, opts?: any) {
      return req<T>(url, { ...opts, method: 'GET' });
    },
    post<T = unknown>(url: string, data?: any, opts?: any) {
      return req<T>(url, { ...opts, method: 'POST', body: data });
    },
    put<T = unknown>(url: string, data?: any, opts?: any) {
      return req<T>(url, { ...opts, method: 'PUT', body: data });
    },
    delete<T = unknown>(url: string, opts?: any) {
      return req<T>(url, { ...opts, method: 'DELETE' });
    },
  };
}
