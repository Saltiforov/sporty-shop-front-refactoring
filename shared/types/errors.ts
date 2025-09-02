export interface IError {
  statusCode: number
  message: string
  errors?: Record<string, string[]>
  timestamp?: string;
}
