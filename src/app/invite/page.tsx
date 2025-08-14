"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<any>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // 1️⃣ Validate invitation token
  useEffect(() => {
    if (!token) {
      setError("No invitation token provided.");
      setLoading(false);
      return;
    }
    const fetchInvite = async () => {
      try {
        const res = await fetch(`/api/invitations/validate?token=${token}`);
        if (!res.ok) throw new Error("Invalid or expired invitation.");
        const data = await res.json();
        setInvite(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [token]);

  // 2️⃣ Handle signup & accept
  const handleAccept = async () => {
    if (!name || !password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const res = await fetch(`/api/invitations/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, password }),
      });
      if (!res.ok) throw new Error("Failed to accept invitation.");
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    }
  };

  if (loading) return <h1>Loading invitation...</h1>;
  if (error) return <h1 color="red">{error}</h1>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="max-w-lg w-full">
        {!showForm ? (
          <>
            <h1>You&apos;re invited!</h1>
            <h1>
              {invite?.inviterName || "A team member"} has invited you to join{" "}
              <strong>{invite?.tenantName || "our medical dashboard"}</strong>.
            </h1>
            <Button
              className="mt-4 w-full"
              color="blue"
              onClick={() => setShowForm(true)}
            >
              Accept Invitation
            </Button>
          </>
        ) : (
          <>
            <h1>Complete Your Registration</h1>
            <h1>Email: {invite?.email}</h1>
            <div className="mt-4 space-y-4">
              
              <Button
                className="w-full"
                color="green"
                onClick={handleAccept}
              >
                Create Account & Join
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
