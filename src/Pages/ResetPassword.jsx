import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { resetPassword } from "../lib/email";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      console.log(response);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
      navigate("/login");
      toast.success("Password reset successfully");
      // redirect to login or login directly
    } catch (err) {
      toast.error("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-25 p-6 border rounded-md">
      <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border px-3 py-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 custom-button py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
