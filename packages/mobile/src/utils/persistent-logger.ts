import * as FileSystem from 'expo-file-system/legacy';

const LOG_MAX_MEMORY = 200;
const LOG_MAX_FILE_SIZE = 500 * 1024; // 500KB
const LOG_MAX_FILES = 3;
const FLUSH_INTERVAL_MS = 5000; // 5s to reduce IO frequency

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  ts: string;
  level: LogLevel;
  msg: string;
  data?: unknown;
}

const LOG_DIR = `${FileSystem.documentDirectory}logs/`;
const CURRENT_LOG = `${LOG_DIR}current.jsonl`;

// In-memory ring buffer (for ErrorBoundary display)
const memoryLogs: LogEntry[] = [];

// Pending entries waiting to be flushed to disk
let pendingEntries: string[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let initialized = false;
let logDirEnsured = false;
let lastRotateCheck = 0;
const ROTATE_CHECK_INTERVAL = 30000; // Check rotation every 30s, not every flush

function formatTime(): string {
  const d = new Date();
  const pad = (n: number, len = 2) => n.toString().padStart(len, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

function isoTimestamp(): string {
  return new Date().toISOString();
}

function addToMemory(entry: LogEntry) {
  memoryLogs.push(entry);
  if (memoryLogs.length > LOG_MAX_MEMORY) memoryLogs.shift();
}

function addToPending(entry: LogEntry) {
  pendingEntries.push(JSON.stringify(entry));
}

async function ensureLogDir() {
  if (logDirEnsured) return;
  try {
    const dirInfo = await FileSystem.getInfoAsync(LOG_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(LOG_DIR, { intermediates: true });
    }
    logDirEnsured = true;
  } catch {
    // Silently fail - logging should never crash the app
  }
}

async function rotateIfNeeded() {
  try {
    const info = await FileSystem.getInfoAsync(CURRENT_LOG);
    if (info.exists && info.size && info.size > LOG_MAX_FILE_SIZE) {
      // Rotate: current -> log-{timestamp}.jsonl
      const rotatedName = `${LOG_DIR}log-${Date.now()}.jsonl`;
      await FileSystem.moveAsync({ from: CURRENT_LOG, to: rotatedName });

      // Clean up old rotated files (keep last LOG_MAX_FILES - 1)
      const files = await FileSystem.readDirectoryAsync(LOG_DIR);
      const rotated = files
        .filter((f) => f.startsWith('log-') && f.endsWith('.jsonl'))
        .sort()
        .reverse();

      for (let i = LOG_MAX_FILES - 1; i < rotated.length; i++) {
        await FileSystem.deleteAsync(`${LOG_DIR}${rotated[i]}`, { idempotent: true });
      }
    }
  } catch {
    // Silently fail
  }
}

async function flushToDisk() {
  if (pendingEntries.length === 0) return;

  const batch = pendingEntries.join('\n') + '\n';
  pendingEntries = [];

  try {
    await ensureLogDir();

    // Only check rotation periodically to reduce IO
    const now = Date.now();
    if (now - lastRotateCheck > ROTATE_CHECK_INTERVAL) {
      lastRotateCheck = now;
      await rotateIfNeeded();
    }

    const info = await FileSystem.getInfoAsync(CURRENT_LOG);
    if (info.exists) {
      // Append by reading existing + writing combined
      const existing = await FileSystem.readAsStringAsync(CURRENT_LOG);
      await FileSystem.writeAsStringAsync(CURRENT_LOG, existing + batch);
    } else {
      await FileSystem.writeAsStringAsync(CURRENT_LOG, batch);
    }
  } catch {
    // Silently fail - don't let logging break the app
  }
}

function startFlushTimer() {
  if (flushTimer) return;
  flushTimer = setInterval(flushToDisk, FLUSH_INTERVAL_MS);
}

function stopFlushTimer() {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

function addLog(level: LogLevel, message: string, data?: unknown) {
  const entry: LogEntry = {
    ts: isoTimestamp(),
    level,
    msg: message,
    data: data !== undefined ? data : undefined,
  };

  addToMemory(entry);
  addToPending(entry);

  // Flush immediately on ERROR
  if (level === 'ERROR' && initialized) {
    flushToDisk();
  }

  // Always output to console (logcat) - in release only WARN/ERROR
  if (__DEV__ || level === 'WARN' || level === 'ERROR' || level === 'INFO') {
    const prefix = `[BBX ${formatTime()}] [${level}]`;
    const consoleFn = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log;
    if (data !== undefined) {
      consoleFn(prefix, message, JSON.stringify(data));
    } else {
      consoleFn(prefix, message);
    }
  }
}

export const logger = {
  debug: (msg: string, data?: unknown) => addLog('DEBUG', msg, data),
  info: (msg: string, data?: unknown) => addLog('INFO', msg, data),
  warn: (msg: string, data?: unknown) => addLog('WARN', msg, data),
  error: (msg: string, data?: unknown) => addLog('ERROR', msg, data),

  getLogs: () => [...memoryLogs],

  getLogsFormatted: () =>
    memoryLogs
      .map(
        (e) =>
          `[${e.ts}] [${e.level}] ${e.msg}${e.data ? ' ' + JSON.stringify(e.data) : ''}`,
      )
      .join('\n'),

  clear: () => {
    memoryLogs.length = 0;
  },

  /** Initialize persistent logging - call once at app start */
  init: async () => {
    if (initialized) return;
    initialized = true;
    await ensureLogDir();
    startFlushTimer();
    addLog('INFO', '=== Logger initialized ===');
  },

  /** Force flush pending entries to disk */
  flush: async () => {
    await flushToDisk();
  },

  /** Read all persisted logs from disk */
  getPersistedLogs: async (): Promise<string> => {
    try {
      const info = await FileSystem.getInfoAsync(CURRENT_LOG);
      if (!info.exists) return '';
      return await FileSystem.readAsStringAsync(CURRENT_LOG);
    } catch {
      return '';
    }
  },

  /** Log a state snapshot for crash context */
  snapshot: (label: string, state: Record<string, unknown>) => {
    addLog('INFO', `SNAPSHOT: ${label}`, state);
  },

  /** Stop the flush timer (for cleanup) */
  destroy: () => {
    stopFlushTimer();
    flushToDisk();
    initialized = false;
  },
};
