export type User = {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string | null;
  birthYear: number | null;
  gender: string | null;
  location: string | null;
  lockedAt: Date | null;
  mfaEnabled: boolean;
} | null;
