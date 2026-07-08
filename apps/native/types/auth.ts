import type { Session } from "better-auth/types";

export interface FlowpayUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  onboardingCompleted: boolean;
  country?: string | null;
  phone?: string | null;
}

export interface FlowpaySession extends Session {
  user: FlowpayUser;
}
