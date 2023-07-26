export class InMemoryDatabase<T> {
  private data: Record<number, T>;
  constructor() {
    this.data = {};
  }

  insert(key: number, value: T): T {
    this.data[key] = value;
    return value;
  }

  get(key: number): T | null {
    return this.data[key] || null;
  }

  delete(key: number): boolean {
    if (key in this.data) {
      delete this.data[key];
      return true;
    }
    return false;
  }

  showAll(): T[] {
    return Object.values(this.data);
  }
}
