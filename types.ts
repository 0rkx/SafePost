export enum AppStatus {
  IDLE = 'IDLE',
  PREVIEW = 'PREVIEW',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export type AppState =
  | { status: AppStatus.IDLE }
  | { status: AppStatus.PREVIEW; file: File; imageUrl: string; preserveElements: string }
  | { status: AppStatus.PROCESSING; imageUrl: string; preserveElements: string }
  | { status: AppStatus.COMPLETE; originalUrl: string; safeImageUrl: string }
  | { status: AppStatus.ERROR; message: string; file: File; imageUrl: string; preserveElements: string };