
declare global {
  export interface Array<T> {
    copy(): Array<T>;
    contains(t: T): boolean;
    select<R>(method: (t: T) => R): Array<R>;
    where(method: (t: T) => any): Array<T>;
    prioritize(method: (t: T) => boolean): Array<T>;
    distinct(): Array<T>;
    any(method: (t: T) => boolean): boolean;
    first(): T;
    firstWhere(method: (t: T) => boolean): T;
    last(): T;
    lastWhere(method: (t: T) => boolean): T;
    count(method: (t: T) => boolean): number;
    sum(method: (t: T) => number): number;
    skip(value: number): Array<T>;
    take(value: number): Array<T>;
  }
}

Array.prototype.copy = function <T>(): Array<T> { return this?.filter((x: any) => true) ?? new Array<T>(); }
Array.prototype.contains = function <T>(t: T): boolean { return this?.some((x: any) => JSON?.stringify(x) === JSON?.stringify(t)) ?? false; }
Array.prototype.select = function <T, R>(method: (t: T) => R): Array<R> { return this?.map(method) ?? new Array<R>(); }
Array.prototype.where = function <T>(method: (t: T) => any): Array<T> { return this?.filter(method) ?? new Array<T>(); }
Array.prototype.prioritize = function <T>(method: (t: T) => boolean): Array<T> { return this?.filter(method).concat(this?.filter((x: any) => method(x) == false)) ?? new Array<T>(); }
Array.prototype.distinct = function <T>(): Array<T> {
  let newList = new Array<T>();
  this.forEach((x: any) => {
    if (newList.contains(x) == false) {
      newList.push(x);
    }
  });
  return newList;
}
Array.prototype.any = function <T>(method: (t: T) => boolean): boolean { return this?.some(method) ?? false; }
Array.prototype.first = function <T>(): T { return this[0] ?? undefined; }
Array.prototype.firstWhere = function <T>(method: (t: T) => boolean): T { return this.where(method)[0] ?? undefined; }
Array.prototype.last = function <T>(): T { return this[this?.length - 1] ?? undefined; }
Array.prototype.lastWhere = function <T>(method: (t: T) => boolean): T { return this.where(method)[this?.length - 1] ?? undefined; }
Array.prototype.count = function <T>(method: (t: T) => boolean): number { return this?.filter(method)?.length ?? 0; }
Array.prototype.sum = function <T>(method: (t: T) => number): number {
  let value = 0;
  this.forEach((x: any) => value += method(x) ?? 0);
  return value;
}
Array.prototype.skip = function <T>(value: number): Array<T> {
  let newList = new Array<T>();
  if (value >= 0) {
    newList = value == 0 ? this : this.slice(value, this.length);
  }
  return newList;
}
Array.prototype.take = function <T>(value: number): Array<T> {
  let newList = new Array<T>();
  if (value >= 0) {
    newList = this.slice(0, Math.min(value, this.length));
  }
  return newList;
}

export { };
