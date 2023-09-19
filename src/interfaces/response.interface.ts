export interface CustomResponse<T> {
  status: string;
  messsage: string | null;
  data: T | null;
}
