import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const passwordValid = password.length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({ title: "Missing Fields", description: "Please fill in both password fields.", variant: "destructive" });
      return;
    }

    if (!passwordValid) {
      toast({ title: "Weak Password", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }

    if (!passwordsMatch) {
      toast({ title: "Passwords Don't Match", description: "Please ensure both passwords are identical.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await authService.resetPassword(token, password);
      if (result) {
        setSuccess(true);
      } else {
        toast({ title: "Reset Failed", description: "Invalid or expired reset link. Please request a new one.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-primary-foreground max-w-md">
          <GraduationCap className="h-16 w-16 mb-8" />
          <h1 className="text-4xl font-heading font-bold mb-4">Set New Password</h1>
          <p className="text-primary-foreground/80 text-lg">
            Choose a strong password to secure your account.
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            EduVerse
          </Link>

          {!token ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-2">Invalid Reset Link</h2>
              <p className="text-muted-foreground mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button asChild className="bg-gradient-primary text-primary-foreground">
                <Link to="/forgot-password">Request New Link</Link>
              </Button>
            </motion.div>
          ) : success ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-2">Password Reset Successfully</h2>
              <p className="text-muted-foreground mb-6">
                Your password has been updated. You can now sign in with your new password.
              </p>
              <Button asChild className="bg-gradient-primary text-primary-foreground">
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl font-heading font-bold mb-2">Reset Password</h2>
              <p className="text-muted-foreground mb-8">Enter your new password below</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <p className={`text-xs mt-1.5 ${passwordValid ? "text-success" : "text-destructive"}`}>
                      {passwordValid ? "✓ Password strength: Good" : "Password must be at least 8 characters"}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p className={`text-xs mt-1.5 ${passwordsMatch ? "text-success" : "text-destructive"}`}>
                      {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary text-primary-foreground"
                  disabled={loading || !passwordValid || !passwordsMatch}
                >
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Resetting...</> : "Reset Password"}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
