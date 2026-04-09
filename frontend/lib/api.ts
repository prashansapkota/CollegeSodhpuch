export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type UserProfile = {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
};

export async function register(email: string, fullName: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, full_name: fullName, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Registration failed");
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }

  return (await response.json()) as LoginResponse;
}

// A single message in the chat conversation.
// role is either "user" (the student) or "assistant" (Claude's replies).
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Sends the full conversation history to the backend and returns Claude's reply.
// We send the whole history (not just the latest message) so Claude has context
// about what was already said — that's how it can follow the conversation.
export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Chat request failed");
  }

  const data = await response.json();
  return data.reply as string;
}

// The student's academic profile — stored in the database, used to personalize AI responses
export type StudentProfile = {
  id: number;
  email: string;
  full_name: string;
  gpa: number | null;
  sat_score: number | null;
  intended_major: string | null;
  target_schools: string | null;
  country_of_origin: string | null;
};

export type ProfileUpdatePayload = {
  gpa?: number | null;
  sat_score?: number | null;
  intended_major?: string | null;
  target_schools?: string | null;
  country_of_origin?: string | null;
};

// Fetches the current user's saved profile to pre-populate the profile form
export async function getProfile(token: string): Promise<StudentProfile> {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch profile");
  }

  return (await response.json()) as StudentProfile;
}

// Saves updated profile fields to the database
export async function updateProfile(token: string, data: ProfileUpdatePayload): Promise<StudentProfile> {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update profile");
  }

  return (await response.json()) as StudentProfile;
}

export async function getCurrentUser(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch user profile");
  }

  return (await response.json()) as UserProfile;
}
