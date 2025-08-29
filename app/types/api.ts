export interface IBasicApi {
  get<T = unknown>(url: string, opts?: object): Promise<T>
  post<T = unknown>(url: string, data?: unknown, opts?: object): Promise<T>
  put<T = unknown>(url: string, data?: unknown, opts?: object): Promise<T>
  delete<T = unknown>(url: string, opts?: object): Promise<T>
}
