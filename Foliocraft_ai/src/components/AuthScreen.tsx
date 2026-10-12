import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../firebase";
import { Mail, Lock, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: () => void;
  onBackToLanding?: () => void;
}

export function AuthScreen({ onAuthSuccess, onBackToLanding }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign-up process
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        const user = userCredential.user;
        
        // Send email verification
        await sendEmailVerification(user);
        
        // Sign them out immediately so they are "not signed in automatically"
        await signOut(auth);
        
        // Show verification screen
        setVerificationEmail(trimmedEmail);
        setIsSignUp(false);
      } else {
        // Sign-in process
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
          // If not verified, send verification email again, sign them out, and block access
          try {
            await sendEmailVerification(user);
          } catch (verifErr) {
            console.warn("Could not resend email verification automatically:", verifErr);
          }
          await signOut(auth);
          setVerificationEmail(trimmedEmail);
          return;
        }
        
        onAuthSuccess();
      }
    } catch (err: any) {
      console.warn("Firebase auth error details:", err);
      if (isSignUp) {
        if (err.code === "auth/email-already-in-use") {
          setError("User already exists. Please sign in");
        } else {
          setError(err.message || "An error occurred during registration");
        }
      } else {
        // For sign-in credentials incorrect, show exact string requested:
        setError("Email or password is incorrect");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onAuthSuccess();
    } catch (err: any) {
      console.warn("Google sign in failed:", err);
      if (err.code === "auth/popup-blocked") {
        setError("Sign-in popup was blocked by your browser. Please allow popups for this site, or open the application in a new tab.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completion.");
      } else if (err.message && err.message.includes("iframe")) {
        setError("Sign-in is restricted inside this iframe view. Please open the app in a new browser tab/window to use Google Sign-In.");
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (verificationEmail) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-[10%] left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#F4B400]/8 to-transparent rounded-full filter blur-[100px] pointer-events-none" />

        {/* Main card */}
        <div className="w-full max-w-md bg-stone-900 border-2 border-stone-850 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
          
          {/* Email Icon */}
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl mb-4 border-2 border-amber-500/20 shadow-md">
              <Mail className="w-8 h-8 animate-bounce text-[#F4B400]" />
            </div>
            <h2 className="text-2xl font-black tracking-tight font-display text-white">
              Verify Your Email
            </h2>
          </div>

          <div className="bg-stone-950/50 border-2 border-stone-800 rounded-2xl p-6 mb-6 text-sm text-stone-300 leading-relaxed text-left">
            We have sent you a verification email to <span className="text-[#F4B400] font-mono break-all font-semibold">{verificationEmail}</span>. Please verify it and log in.
          </div>

          <button
            id="auth-verification-login-btn"
            onClick={() => {
              setVerificationEmail(null);
              setIsSignUp(false);
              setError(null);
            }}
            className="w-full bg-[#F4B400] hover:bg-yellow-500 text-stone-950 font-black py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_rgba(28,25,23,1)] border-2 border-stone-950 cursor-pointer text-center"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-[10%] left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#F4B400]/8 to-transparent rounded-full filter blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-stone-900 border-2 border-stone-850 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Brand logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-[#F4B400] rounded-2xl text-stone-950 mb-3 border-2 border-stone-950 shadow-[2px_2px_0px_rgba(28,25,23,1)]">
            <Sparkles className="w-6 h-6 fill-stone-950 text-stone-950 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight font-display text-white text-center">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-stone-400 mt-1.5 text-center">
            {isSignUp 
              ? "Join FolioCraft to build and publish your portfolio mockup" 
              : "Sign in to access your FolioCraft builder dashboard"
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/40 border-2 border-red-900/50 rounded-2xl p-4 flex gap-2.5 items-start text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-mono font-black text-red-400 tracking-wider">Authentication Alert</span>
              <span className="text-xs font-semibold leading-relaxed">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono text-stone-400 uppercase block tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-stone-950 border-2 border-stone-850 rounded-xl py-3 pl-11 pr-4 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-[#F4B400] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono text-stone-400 uppercase block tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="auth-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-stone-950 border-2 border-stone-850 rounded-xl py-3 pl-11 pr-4 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-[#F4B400] transition-colors"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-[#F4B400] hover:bg-yellow-500 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-black py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_rgba(28,25,23,1)] border-2 border-stone-950 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-stone-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-stone-800"></div>
        </div>

        <button
          id="btn-google-signin"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-stone-100 disabled:bg-stone-800 disabled:text-stone-600 text-stone-900 font-extrabold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2.5 shadow-[3px_3px_0px_rgba(28,25,23,1)] border-2 border-stone-950 cursor-pointer text-center"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.62-1.05-1.34-1.19-2.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="font-bold">Continue with Google</span>
        </button>

        {/* Auth mode toggle */}
        <div className="mt-8 pt-6 border-t border-stone-850 text-center">
          <p className="text-xs text-stone-400">
            {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{" "}
            <button
              id="auth-toggle-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-[#F4B400] hover:underline font-bold focus:outline-none"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        {onBackToLanding && (
          <div className="mt-4 text-center">
            <button
              id="auth-back-btn"
              onClick={onBackToLanding}
              className="text-stone-500 hover:text-stone-300 text-xs font-bold transition-colors focus:outline-none"
            >
              Back to Landing Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
