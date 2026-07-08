import { FlowpayUser } from "@/types/auth";


export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  country?: string;
  image?: string;
}

export interface UpdateProfileResponse {
  user: FlowpayUser;
}

export interface OnboardingCompleteResponse {
  success: boolean;
  user: FlowpayUser;
}

export interface AuthResponse {
  user: FlowpayUser;
  token?: string;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
}
