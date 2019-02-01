/**
 * SerializableException supports to be JSON.stringify-ed.
 */
export abstract class SerializableException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }

  public toJSON(): any {
    const json: any = {};
    Object.getOwnPropertyNames(this).forEach(
      p => p !== 'stack' && (json[p] = (<any>this)[p])
    );

    return json;
  }
}
