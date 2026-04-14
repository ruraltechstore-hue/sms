import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, ROLE_DASHBOARD } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      // We need to get the role from the email to redirect
      const roleMap: Record<string, string> = {
        "admin@school.com": "/dashboard/admin",
        "teacher@school.com": "/dashboard/teacher",
        "student@school.com": "/dashboard/student",
        "parent@school.com": "/dashboard/parent",
      };
      navigate(roleMap[email.toLowerCase()] || "/dashboard/admin");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email. Try admin@school.com, teacher@school.com, student@school.com, or parent@school.com",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-primary-foreground max-w-md">
          <GraduationCap className="h-16 w-16 mb-8" />
          <h1 className="text-4xl font-heading font-bold mb-4">Welcome back to EduVerse</h1>
          <p className="text-primary-foreground/80 text-lg">Manage your institution with the most powerful school management platform.</p>
          <div className="mt-8 p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-primary-foreground/80">
              <p>admin@school.com → Admin</p>
              <p>teacher@school.com → Teacher</p>
              <p>student@school.com → Student</p>
              <p>parent@school.com → Parent</p>
            </div>
          </div>
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

          <h2 className="text-2xl font-heading font-bold mb-2">Sign in</h2>
          <p className="text-muted-foreground mb-8">Enter your credentials to access the portal</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@school.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground">
              Sign In
            </Button>
          </form>

          {/* Demo credentials for mobile */}
          <div className="lg:hidden mt-6 p-4 rounded-xl border bg-card">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>admin@school.com • teacher@school.com</p>
              <p>student@school.com • parent@school.com</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
