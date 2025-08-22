import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { sendVerificationEmail } from "../lib/email";

function SendVerified() {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await sendVerificationEmail();
      if (response.error) {
        toast.error(response.error);
        setLoading(false);
        console.error(response);
        toast.error(`${response.message}`);
        return;
      }
      console.log(response);
      setLoading(false);
      toast.success(`${response.message}`);
    } catch (err) {
      toast.error("Failed to send verification email.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold mb-4">Email Verification Required</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Your email is not verified yet. Please check your inbox and click the
        verification link. If you didn't receive the email, you can resend it.
      </p>
      <Button
        onClick={handleResend}
        className="custom-button"
        disabled={loading}
      >
        {loading ? "Sending..." : "Resend Verification Email"}
      </Button>
    </div>
  );
}

export default SendVerified;
