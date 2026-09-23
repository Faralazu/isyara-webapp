import { LogEntry, LogLevel } from "@/types";

/**
 * Standard structured logger implementation
 * Grounded in SRD Section 8.2
 */
export class IsyaraLogger {
  private static instance: IsyaraLogger;
  private logLevel: LogLevel =
    process.env.NODE_ENV === "production" ? "INFO" : "DEBUG";

  private constructor() {}

  public static getInstance(): IsyaraLogger {
    if (!IsyaraLogger.instance) {
      IsyaraLogger.instance = new IsyaraLogger();
    }
    return IsyaraLogger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["DEBUG", "INFO", "WARN", "ERROR"];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  public log(entry: Omit<LogEntry, "timestamp">): void {
    if (!this.shouldLog(entry.level)) return;

    const fullEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    const output = JSON.stringify(fullEntry);
    switch (entry.level) {
      case "ERROR":
        console.error(output);
        break;
      case "WARN":
        console.warn(output);
        break;
      case "INFO":
        console.info(output);
        break;
      case "DEBUG":
        console.debug(output);
        break;
    }
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

export const logger = IsyaraLogger.getInstance();
