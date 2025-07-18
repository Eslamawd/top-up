import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Alert, AlertDescription } from "./ui/Alert";
import { Mail, Lock, Eye, EyeOff, Info } from "lucide-react";
import { Separator } from "./ui/Separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/Dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { motion } from "framer-motion"; // تأكد إنك تستورد motion من framer-motion
import MainLayout from "./MainLayout"; // تأكد من مسار الاستيراد
import api from "../api/axiosClient";

const LoginComponent = () => {
  const navigate = useNavigate();
  const { login , user } = useAuth();
  // حالات التحكم بالحقول والواجهات
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // إضافي: حالة تحكم عرض نافذة إعادة تعيين كلمة المرور
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  // دالة لتحديث بيانات النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // دالة تسجيل الدخول
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    // تأكد من أخذ الـ CSRF cookie
    await api().get("/sanctum/csrf-cookie");

    // تسجيل الدخول
    const response = await api().post("/login", formData);
    if (response.status !== 200) {
      throw new Error("Login failed");
    }
    const userData = response.data.user; // افترض أن الـ API يعيد بيانات المستخدم
    await login(userData); // استدعاء دالة تسجيل الدخول من الـ context
    toast.success("Login successful!");

    // قم بتخزين المستخدم في الـ context
    navigate("/"); // التوجيه بعد الدخول
  } catch (err) {
    if (err.response?.status === 422) {
      toast.error("Invalid email or password.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  // دالة لإرسال رابط إعادة تعيين كلمة المرور
  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email");
      return;
    }
    setResetSubmitting(true);
    try {
      // هنا تستدعي دالة إرسال رابط إعادة تعيين كلمة المرور
      // await sendResetEmail(resetEmail); // مثال إذا عندك دالة من الـ context أو API
; // استبدل هذا بالدالة الحقيقية
      await new Promise((r) => setTimeout(r, 1000));
      
      setResetSent(true);
      toast.success("Reset link sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setResetSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="flex justify-center items-center py-12 px-4"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-2">
                <Info className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="relative">
              <Separator />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email"  className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      Password
                    </Label>
                    <Button
                      variant="link"
                      className="text-xs p-0 h-auto"
                      onClick={() => setShowResetDialog(true)}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>

            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {resetSent ? (
              <Alert className="border-green-500 text-green-800 dark:text-green-200 bg-green-50 dark:bg-green-900/20">
                <AlertDescription>
                  Password reset link has been sent to your email.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="resetEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="resetEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowResetDialog(false)}
              disabled={resetSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={resetSubmitting || resetSent}>
              {resetSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default LoginComponent;
