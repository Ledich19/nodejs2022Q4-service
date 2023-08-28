export class InMemoryDatabase<T> {
  private data: Record<string, T>;
  constructor() {
    this.data = {};
  }

  insert(key: string, value: T): T {
    this.data[key] = value;
    return value;
  }

  get(key: string): T | null {
    return this.data[key] || null;
  }

  delete(key: string): boolean {
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
