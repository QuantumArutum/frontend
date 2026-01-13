// Type declarations for better-sqlite3
// This is a placeholder for when the module is not installed

declare module 'better-sqlite3' {
  namespace Database {
    interface Options {
      readonly?: boolean;
      fileMustExist?: boolean;
      timeout?: number;
      verbose?: (message?: unknown, ...additionalArgs: unknown[]) => void;
    }

    interface RunResult {
      changes: number;
      lastInsertRowid: number | bigint;
    }

    interface Statement {
      run(...params: unknown[]): RunResult;
      get(...params: unknown[]): unknown;
      all(...params: unknown[]): unknown[];
      iterate(...params: unknown[]): IterableIterator<unknown>;
      bind(...params: unknown[]): this;
    }

    // Self-referencing type for Database.Database usage
    type Database = InstanceType<typeof import('better-sqlite3')>;
  }

  class Database {
    constructor(filename: string, options?: Database.Options);
    prepare(sql: string): Database.Statement;
    exec(sql: string): this;
    transaction<T>(fn: (...args: unknown[]) => T): (...args: unknown[]) => T;
    pragma(pragma: string, options?: { simple?: boolean }): unknown;
    close(): void;
  }

  export = Database;
}
