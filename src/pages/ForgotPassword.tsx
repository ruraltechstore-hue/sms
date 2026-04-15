import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Loader2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      // Always show success to prevent email enumeration
      setSent(true);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
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
          <h1 className="text-4xl font-heading font-bold mb-4">Reset Your Password</h1>
          <p className="text-primary-foreground/80 text-lg">
            Enter your email address and we'll send you instructions to reset your password.
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

          {sent ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">
                If an account exists for <span className="font-medium text-foreground">{email}</span>, you'll receive a password reset link shortly.
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/login">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl font-heading font-bold mb-2">Forgot Password</h2>
              <p className="text-muted-foreground mb-8">
                Enter your registered email to receive a password reset link
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : "Send Reset Link"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
