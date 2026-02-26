"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser, UserProfile } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    getCurrentUser(token)
      .then(setProfile)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unauthorized");
        localStorage.removeItem("access_token");
      });
  }, [router]);

  return (
    <section className="card">
      <h1>Dashboard</h1>
      {!profile && !error && <p>Loading profile...</p>}
      {error && <p style={{ color: "#c62828" }}>{error}</p>}
      {profile && (
        <div>
          <p>
            <strong>Name:</strong> {profile.full_name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Active:</strong> {profile.is_active ? "Yes" : "No"}
          </p>
        </div>
      )}
    </section>
  );
}
