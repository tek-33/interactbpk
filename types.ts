export interface ClubMessage {
  id: string;
  sender_name: string;
  sender_contact: string;
  subject: string;
  body: string;
  reply: string | null;
  replied_at: string | null;
  status: 'pending' | 'answered';
  is_public: boolean;
  created_at: string;
}

export interface ClubAnnouncement {
  id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  token: string;
}
