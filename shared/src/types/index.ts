export type ApiResponse = {
  message: string;
  success: true;
}

export interface LogEntry {
  id: string
  note: string
  tags: string[]
  links: string[]
  date: string // ISO format (e.g., 2025-07-14T10:00:00Z)
  createdAt: string
  updatedAt: string
}
