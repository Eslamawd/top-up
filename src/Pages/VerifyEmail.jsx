// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { verificationEmail } from "../lib/email";
import { toast } from "sonner";

export default function VerifyEmail() {
  const { id, hash } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessages] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const quary = location.search;

      try {
        const data = await verificationEmail(id, hash, quary);
        setMessages(data.message);
        navigate("/");
        console.log("Email verified successfully:", data);
        toast.success(data.message);
      } catch (error) {
        setError(error);
        setMessages("Error verifying email");
        console.error("Error verifying email:", error);
        toast.error("Error verifying email");
      }
    };

    verifyEmail();
  }, [id, hash, location.search, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
      {error ? (
        <p className="text-red-500">{message}</p>
      ) : (
        <p className="text-green-500">{message}</p>
      )}
      <p className="text-gray-500">Please wait while we verify your email.</p>
      <p>Verifying...</p>
    </div>
  );
}
