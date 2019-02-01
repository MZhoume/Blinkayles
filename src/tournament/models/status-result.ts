export class StatusResult<T> {
  public id: string;
  public status: T;

  constructor(id: string, status: T) {
    this.id = id;
    this.status = status;
  }
}
