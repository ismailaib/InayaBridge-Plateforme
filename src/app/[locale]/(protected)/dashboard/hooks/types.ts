export interface Member {
  id: string;
  email: string;
  status: string;
  sentAt: string;
  acceptedAt?: string;
  expiresAt?: string;
}

export interface InviteMembersProps {
  onSuccess?: () => void;
}
