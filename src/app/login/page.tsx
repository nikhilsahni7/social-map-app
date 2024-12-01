// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Please verify your email before logging in") {
          setNeedsVerification(true);
          throw new Error(data.error);
        }
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("username", JSON.stringify(data.user.name));




      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }

      toast.success(
        "If your email is unverified, you will receive a new verification link shortly"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend verification"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-700">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Please sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="text-sm text-blue-600 hover:underline p-0"
                  onClick={() => router.push("/forgot-password")}
                >
                  Forgot password?
                </Button>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            {needsVerification && (
              <div className="mt-4">
                <p className="text-sm text-red-600 mb-2">
                  Please verify your email before logging in.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResendVerification}
                  disabled={isLoading}
                >
                  Resend Verification Email
                </Button>
              </div>
            )}
          </CardContent>
          <Separator className="my-4" />
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
