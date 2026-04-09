"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register, login } from "@/lib/api";

// --- Animated character helpers ---

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

function EyeBall({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "black", isBlinking = false, forceLookX, forceLookY }: EyeBallProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const getPos = () => {
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    if (!ref.current) return { x: 0, y: 0 };
    const r = ref.current.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2);
    const dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = getPos();

  return (
    <div ref={ref} className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{ width: size, height: isBlinking ? 2 : size, backgroundColor: eyeColor, overflow: "hidden" }}>
      {!isBlinking && (
        <div className="rounded-full" style={{
          width: pupilSize, height: pupilSize, backgroundColor: pupilColor,
          transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform 0.1s ease-out"
        }} />
      )}
    </div>
  );
}

function Pupil({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }: { size?: number; maxDistance?: number; pupilColor?: string; forceLookX?: number; forceLookY?: number }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const getPos = () => {
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    if (!ref.current) return { x: 0, y: 0 };
    const r = ref.current.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2);
    const dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = getPos();
  return (
    <div ref={ref} className="rounded-full" style={{
      width: size, height: size, backgroundColor: pupilColor,
      transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform 0.1s ease-out"
    }} />
  );
}

function Characters({ isTyping, showPassword, password }: { isTyping: boolean; showPassword: boolean; password: string }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [purpleBlink, setPurpleBlink] = useState(false);
  const [blackBlink, setBlackBlink] = useState(false);
  const [lookingAtEachOther, setLookingAtEachOther] = useState(false);
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Blinking
  useEffect(() => {
    const schedule = (setter: (v: boolean) => void) => {
      const t = setTimeout(() => { setter(true); setTimeout(() => { setter(false); schedule(setter); }, 150); }, Math.random() * 4000 + 3000);
      return t;
    };
    const t1 = schedule(setPurpleBlink);
    const t2 = schedule(setBlackBlink);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Look at each other when typing starts
  useEffect(() => {
    if (isTyping) {
      setLookingAtEachOther(true);
      const t = setTimeout(() => setLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    }
  }, [isTyping]);

  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 3;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const pp = calcPos(purpleRef);
  const bp = calcPos(blackRef);
  const yp = calcPos(yellowRef);
  const op = calcPos(orangeRef);

  const hiding = isTyping || (password.length > 0 && !showPassword);
  const peeking = password.length > 0 && showPassword;

  return (
    <div className="relative" style={{ width: 550, height: 400 }}>
      {/* Purple */}
      <div ref={purpleRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{ left: 70, width: 180, height: hiding ? 440 : 400, backgroundColor: "#6C3FF5", borderRadius: "10px 10px 0 0", zIndex: 1,
          transform: peeking ? "skewX(0deg)" : hiding ? `skewX(${pp.bodySkew - 12}deg) translateX(40px)` : `skewX(${pp.bodySkew}deg)`,
          transformOrigin: "bottom center" }}>
        <div className="absolute flex gap-8 transition-all duration-700 ease-in-out"
          style={{ left: peeking ? 20 : lookingAtEachOther ? 55 : 45 + pp.faceX, top: peeking ? 35 : lookingAtEachOther ? 65 : 40 + pp.faceY }}>
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={purpleBlink}
            forceLookX={peeking ? 4 : lookingAtEachOther ? 3 : undefined} forceLookY={peeking ? 5 : lookingAtEachOther ? 4 : undefined} />
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={purpleBlink}
            forceLookX={peeking ? 4 : lookingAtEachOther ? 3 : undefined} forceLookY={peeking ? 5 : lookingAtEachOther ? 4 : undefined} />
        </div>
      </div>

      {/* Black */}
      <div ref={blackRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{ left: 240, width: 120, height: 310, backgroundColor: "#2D2D2D", borderRadius: "8px 8px 0 0", zIndex: 2,
          transform: peeking ? "skewX(0deg)" : lookingAtEachOther ? `skewX(${bp.bodySkew * 1.5 + 10}deg) translateX(20px)` : hiding ? `skewX(${bp.bodySkew * 1.5}deg)` : `skewX(${bp.bodySkew}deg)`,
          transformOrigin: "bottom center" }}>
        <div className="absolute flex gap-6 transition-all duration-700 ease-in-out"
          style={{ left: peeking ? 10 : lookingAtEachOther ? 32 : 26 + bp.faceX, top: peeking ? 28 : lookingAtEachOther ? 12 : 32 + bp.faceY }}>
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={blackBlink}
            forceLookX={peeking ? -4 : lookingAtEachOther ? 0 : undefined} forceLookY={peeking ? -4 : lookingAtEachOther ? -4 : undefined} />
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={blackBlink}
            forceLookX={peeking ? -4 : lookingAtEachOther ? 0 : undefined} forceLookY={peeking ? -4 : lookingAtEachOther ? -4 : undefined} />
        </div>
      </div>

      {/* Orange */}
      <div ref={orangeRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{ left: 0, width: 240, height: 200, backgroundColor: "#FF9B6B", borderRadius: "120px 120px 0 0", zIndex: 3,
          transform: peeking ? "skewX(0deg)" : `skewX(${op.bodySkew}deg)`, transformOrigin: "bottom center" }}>
        <div className="absolute flex gap-8 transition-all duration-200 ease-out"
          style={{ left: peeking ? 50 : 82 + op.faceX, top: peeking ? 85 : 90 + op.faceY }}>
          <Pupil size={12} pupilColor="#2D2D2D" forceLookX={peeking ? -5 : undefined} forceLookY={peeking ? -4 : undefined} />
          <Pupil size={12} pupilColor="#2D2D2D" forceLookX={peeking ? -5 : undefined} forceLookY={peeking ? -4 : undefined} />
        </div>
      </div>

      {/* Yellow */}
      <div ref={yellowRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{ left: 310, width: 140, height: 230, backgroundColor: "#E8D754", borderRadius: "70px 70px 0 0", zIndex: 4,
          transform: peeking ? "skewX(0deg)" : `skewX(${yp.bodySkew}deg)`, transformOrigin: "bottom center" }}>
        <div className="absolute flex gap-6 transition-all duration-200 ease-out"
          style={{ left: peeking ? 20 : 52 + yp.faceX, top: peeking ? 35 : 40 + yp.faceY }}>
          <Pupil size={12} pupilColor="#2D2D2D" forceLookX={peeking ? -5 : undefined} forceLookY={peeking ? -4 : undefined} />
          <Pupil size={12} pupilColor="#2D2D2D" forceLookX={peeking ? -5 : undefined} forceLookY={peeking ? -4 : undefined} />
        </div>
        <div className="absolute w-20 h-1 bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
          style={{ left: peeking ? 10 : 40 + yp.faceX, top: peeking ? 88 : 88 + yp.faceY }} />
      </div>
    </div>
  );
}

// --- Main Register Page ---

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, fullName, password);
      const result = await login(email, password);
      localStorage.setItem("access_token", result.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — animated characters */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-violet-800 p-12 text-white">
        <div className="text-lg font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">C</div>
          CollegeSodhpuch
        </div>

        <div className="flex items-end justify-center h-[420px]">
          <div style={{ transform: "scale(0.8)", transformOrigin: "bottom center" }}>
            <Characters isTyping={isTyping} showPassword={showPassword} password={password} />
          </div>
        </div>

        <p className="text-white/60 text-sm">Helping Nepali students navigate U.S. college applications.</p>
      </div>

      {/* Right — register form */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-neutral-950">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Create your account</h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Free to use — start today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" type="text" placeholder="Prashansa Sapkota"
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)}
                required className="h-12" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)}
                required className="h-12" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required className="h-12 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full h-12 text-base">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-neutral-900 underline underline-offset-4 dark:text-neutral-100">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
