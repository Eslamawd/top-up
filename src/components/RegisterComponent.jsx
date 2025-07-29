import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, User, Mail, Phone, Lock, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card";
import { toast } from "sonner";
import { Separator } from "./ui/Separator";
import { Alert, AlertDescription } from "./ui/Alert";


import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";


const RegisterComponent= () => {
  const navigate = useNavigate();
  const {  user, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user,  navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const register = async (formData) => {
  try{
    await api().get("/sanctum/csrf-cookie"); // مهم في تسجيل الحساب الجديد
    const response = await api().post("/register", formData);
    console.log(response);
    await login(response.data.user)
    if (response.status !== 200) {
      throw new Error("Registration failed");
    }
    toast.success("Registration successful!");
    return response.data.user; // نعيد المستخدم فقط
  } catch (error) {

    return error; // نرمي الخطأ لنعالجه في handleSubmit
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // التحقق من صحة البيانات
  if (!isValidEmail(formData.email)) {
    return toast.error("Please enter a valid email address");
  }

  if (formData.password !== formData.password_confirmation) {
    return toast.error("Passwords don't match");
  }

  if (formData.password.length < 8) {
    return toast.error("Password must be at least 8 characters long");
  }
  if (formData.phone.length < 10) {
    return toast.error("Phone number is Required");
  }

  setIsSubmitting(true);

  try {
  const  response  = await register(formData);

const user = response?.user;
const message = response?.data?.message;

if (!user) {
  throw new Error(message || "Registration failed");
}

toast.success(`Registration successful: : ${user.name} `);
navigate('/login');


  } catch (error) {
    const backendErrors = error.response?.data?.errors;
    if (backendErrors) {
      const messages = Object.values(backendErrors).flat();
      toast.error(messages[0]);
      setError(messages[0]);
    } else {
      setError(error.message || "An unexpected error occurred during registration");
      toast.error(error.message || "Something went wrong.");
    }
  } finally {
    setIsSubmitting(false);
  }
};




  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="flex justify-center items-center py-12 px-4"
      >
        <Card className="w-full mt-16 max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>
              Register to access our services and manage your subscriptions
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
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input 
                    name="name" 
                    placeholder="Enter your full name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
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
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone Number (Optional)
                  </Label>
                  <Input 
                    name="phone" 
                    placeholder="Enter your phone number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password (min. 8 characters)"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <span
                      type="button"
                      className="absolute right-3  top-1/2  bg-blue-950 text-white ml-0  px-2 items-center text-center py-2 rounded text-sm flex justify-between flex-row font-medium -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation" className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-muted-foreground" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input 
                      name="password_confirmation" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm your password"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <span
                      type="button"
                      className="absolute  bg-blue-950 text-white ml-0  px-2 items-center text-center py-2 rounded text-sm flex justify-between flex-row font-medium right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <Button className="w-full custom-button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Register"}
                </Button>
              </div>
            </form>

            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default RegisterComponent;
