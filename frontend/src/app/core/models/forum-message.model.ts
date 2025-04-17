export interface ForumMessage {
  id?: number;
  name: string;
  message: string;
  createdAt: Date;
  userEmail?: string;
} 