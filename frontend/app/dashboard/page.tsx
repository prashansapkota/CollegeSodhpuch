"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, CornerDownLeft, Info, LayoutDashboard, Mic, Paperclip, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { getProfile, sendChatMessage, StudentProfile, updateProfile } from "@/lib/api";

type DashboardView = "information" | "agent" | "profile";

function DashboardLogo() {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
      <span className="text-sm font-medium text-black dark:text-white">CollegeSodhpuch</span>
    </div>
  );
}

function DashboardLogoIcon() {
  return <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />;
}

function InformationView() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    universities: false,
    sat: false,
    visa: false,
  });

  const toggle = (topic: "universities" | "sat" | "visa") => {
    setExpanded((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  return (
    <div className="grid gap-4">
      <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Best and Safety Universities
        </h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
          Most students should build their college list in two layers: dream schools and safe
          schools. Dream schools are highly competitive institutions known for strong academics,
          research opportunities, and global reputation. They can be worth aiming for, but
          admissions are unpredictable even for excellent applicants.
        </p>
        <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
          Safety universities are where your profile is comfortably above the typical admitted
          range. These are not backup schools with low quality. A smart safety list gives you good
          academics, better scholarship probability, and peace of mind when decision season starts.
        </p>
        <button
          onClick={() => toggle("universities")}
          className="mt-4 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-100 transition hover:bg-black"
        >
          {expanded.universities ? "Less ^" : "More >"}
        </button>

        {expanded.universities && (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/60">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-200">
              How to use this in your shortlist
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
              <li>
                Keep a balanced list: about 20-30% dream, 40-50% match, and 20-30% safety.
              </li>
              <li>
                Validate outcomes with each university&apos;s official admissions pages and cost
                estimators before finalizing.
              </li>
              <li>
                Prioritize accredited institutions and compare academic fit, scholarship policies,
                and total cost of attendance.
              </li>
            </ul>

            <div className="mt-4 space-y-2 text-sm">
              <p className="font-medium text-neutral-800 dark:text-neutral-100">Reliable links</p>
              <a
                href="https://www.commonapp.org/apply/first-time-students"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                Common App: First-year application guide
              </a>
              <a
                href="https://educationusa.state.gov/"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                EducationUSA: Official U.S. higher-ed advising network
              </a>
              <a
                href="https://educationusa.state.gov/your-5-steps-us-study"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                EducationUSA: Your 5 Steps to U.S. Study
              </a>
            </div>
          </div>
        )}
      </article>

      <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          SAT: Most Important Exam
        </h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
          For many international applicants, SAT can become the strongest academic signal in the
          file. A high score can improve admission chances and unlock scholarship conversations,
          especially when your school system and grading scale are unfamiliar to U.S. colleges.
        </p>
        <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
          Treat SAT prep like a project: diagnostic test, weekly practice schedule, error log,
          timed mocks, and retake strategy. If you score well, it can move your application from
          “possible” to “serious.”
        </p>
        <button
          onClick={() => toggle("sat")}
          className="mt-4 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-100 transition hover:bg-black"
        >
          {expanded.sat ? "Less ^" : "More >"}
        </button>

        {expanded.sat && (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/60">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-200">
              High-impact SAT strategy
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
              <li>Start with one full diagnostic test and identify your weakest 2-3 skill areas.</li>
              <li>
                Use timed weekly blocks: concepts, drills, and one section-length simulation.
              </li>
              <li>
                Track every missed question by reason (content gap, timing, or careless error) and
                revise based on the pattern.
              </li>
            </ul>

            <div className="mt-4 space-y-2 text-sm">
              <p className="font-medium text-neutral-800 dark:text-neutral-100">Reliable links</p>
              <a
                href="https://satsuite.collegeboard.org/sat/registration"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                College Board: SAT registration
              </a>
              <a
                href="https://satsuite.collegeboard.org/scores/sat"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                College Board: SAT scores and timelines
              </a>
              <a
                href="https://www.khanacademy.org/test-prep/sat/sat-study-plans/sat-study-plan/a/sat-study-schedule"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                Khan Academy: Digital SAT study schedule
              </a>
            </div>
          </div>
        )}
      </article>

      <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Visa Application: International Students from Nepal
        </h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
          After receiving your university admit and funding details, your next critical step is the
          F-1 student visa process. For Nepali students, success usually comes from preparation:
          correct documents, clear financial proof, and confident interview answers.
        </p>
        <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
          Focus on showing three things clearly: your academic plan in the U.S., your ability to
          finance your studies, and your intent to return after completing your program.
        </p>
        <button
          onClick={() => toggle("visa")}
          className="mt-4 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-100 transition hover:bg-black"
        >
          {expanded.visa ? "Less ^" : "More >"}
        </button>

        {expanded.visa && (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/60">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-200">
              Recommended visa prep checklist
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
              <li>Get your I-20 from the university and verify all details match your passport.</li>
              <li>Pay SEVIS I-901 fee, then complete the DS-160 accurately.</li>
              <li>Book your visa appointment at the U.S. Embassy in Kathmandu.</li>
              <li>
                Prepare finances: sponsor letters, bank statements, income proofs, and funding
                source consistency.
              </li>
              <li>
                Practice interview responses on study plan, university choice, finances, and
                post-study intent.
              </li>
            </ul>

            <div className="mt-4 space-y-2 text-sm">
              <p className="font-medium text-neutral-800 dark:text-neutral-100">Reliable links</p>
              <a
                href="https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                U.S. Department of State: Student Visa (F-1)
              </a>
              <a
                href="https://www.fmjfee.com/"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                SEVIS I-901 Fee Payment Portal
              </a>
              <a
                href="https://ceac.state.gov/CEAC/"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                DS-160 Application (CEAC)
              </a>
              <a
                href="https://np.usembassy.gov/visas/"
                target="_blank"
                rel="noreferrer"
                className="block text-neutral-700 underline underline-offset-4 hover:text-black dark:text-neutral-200 dark:hover:text-white"
              >
                U.S. Embassy in Nepal: Visa Information
              </a>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

type AgentMessage = {
  role: "user" | "agent";
  text: string;
};

function AgentView() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      role: "agent",
      text: "Hi, I am your CollegeSodhpuch agent. Ask me about college list strategy, SAT prep, application deadlines, or visa steps.",
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Silently fetch the user's profile on load so we can personalize AI responses
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    getProfile(token)
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const message = value.trim();
    if (!message || isLoading) {
      return;
    }

    const updatedMessages: AgentMessage[] = [
      ...messages,
      { role: "user", text: message },
    ];
    setMessages(updatedMessages);
    setValue("");
    setIsLoading(true);

    try {
      // Build a profile context string to prepend to the conversation.
      // This tells the AI who the student is so responses are personalized.
      // Only include fields that have been filled in.
      const profileLines: string[] = [];
      if (profile.full_name) profileLines.push(`Student name: ${profile.full_name}`);
      if (profile.gpa) profileLines.push(`GPA: ${profile.gpa}`);
      if (profile.sat_score) profileLines.push(`SAT score: ${profile.sat_score}`);
      if (profile.intended_major) profileLines.push(`Intended major: ${profile.intended_major}`);
      if (profile.target_schools) profileLines.push(`Target schools: ${profile.target_schools}`);
      if (profile.country_of_origin) profileLines.push(`Country: ${profile.country_of_origin}`);

      const profileContext = profileLines.length > 0
        ? `[Student profile: ${profileLines.join(", ")}]\n`
        : "";

      // Build the conversation history. If we have profile data, inject it
      // as context at the start of the first user message so the AI knows
      // who it's talking to without the user having to repeat themselves.
      const apiMessages = updatedMessages
        .slice(1)
        .map((msg, index) => ({
          role: msg.role === "user" ? "user" : "assistant" as "user" | "assistant",
          content: index === 0 && msg.role === "user" && profileContext
            ? profileContext + msg.text
            : msg.text,
        }));

      const reply = await sendChatMessage(apiMessages);
      setMessages((prev) => [...prev, { role: "agent", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Sorry, I ran into an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Agent: Ask Your Questions
      </h2>
      <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
        Use the CollegeSodhpuch agent to get quick answers about application timelines, document
        checklists, SAT strategy, scholarship positioning, and visa interview preparation.
      </p>

      <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/70">
        <div className="max-h-[480px] space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-6",
                message.role === "user"
                  ? "ml-auto bg-black text-white"
                  : "bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200",
              )}
            >
              {message.role === "agent" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="mb-2 list-disc pl-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="leading-6">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    h1: ({ children }) => <h1 className="text-base font-bold mb-1 mt-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-sm font-bold mb-1 mt-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2">{children}</h3>,
                    code: ({ children }) => <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">{children}</code>,
                    hr: () => <hr className="my-2 border-neutral-200 dark:border-neutral-700" />,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              ) : (
                message.text
              )}
            </div>
          ))}
          {isLoading && (
            <div className="max-w-[85%] rounded-xl bg-white px-3 py-2 text-sm leading-6 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500">
              Thinking...
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {[
          "Build a 6-month application roadmap for me.",
          "Which universities should be in my best/match/safety list?",
          "Create an SAT study plan for my current score.",
          "Give me a visa interview prep checklist.",
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => setValue(prompt)}
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-left text-sm text-neutral-100 transition hover:bg-black"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="mt-5 rounded-lg border border-neutral-200 bg-background p-1 focus-within:ring-1 focus-within:ring-ring dark:border-neutral-700"
        onSubmit={handleSubmit}
      >
        <ChatInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-12 resize-none rounded-lg border-0 bg-background p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Paperclip className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Mic className="size-4" />
            <span className="sr-only">Use Microphone</span>
          </Button>

          <Button type="submit" size="sm" disabled={isLoading} className="ml-auto gap-1.5 bg-black text-white hover:bg-neutral-800 disabled:opacity-50">
            {isLoading ? "Thinking..." : "Send Message"}
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}

function ProfileView() {
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing profile when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    getProfile(token)
      .then((data) => setProfile(data))
      .catch(() => {}); // silently ignore if profile fetch fails
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const updated = await updateProfile(token, {
        gpa: profile.gpa ?? null,
        sat_score: profile.sat_score ?? null,
        intended_major: profile.intended_major ?? null,
        target_schools: profile.target_schools ?? null,
        country_of_origin: profile.country_of_origin ?? null,
      });
      setProfile(updated);
      setSaved(true);
      // Hide the success message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Your Student Profile
      </h2>
      <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
        Fill in your academic details. The AI agent will use this information to give you
        personalized advice on college selection, SAT prep, and visa preparation.
      </p>

      <form onSubmit={handleSave} className="mt-6 grid gap-5">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            GPA (out of 4.0)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            placeholder="e.g. 3.7"
            value={profile.gpa ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, gpa: e.target.value ? parseFloat(e.target.value) : null }))}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            SAT Score (400–1600)
          </label>
          <input
            type="number"
            min="400"
            max="1600"
            placeholder="e.g. 1350"
            value={profile.sat_score ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, sat_score: e.target.value ? parseInt(e.target.value) : null }))}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Intended Major
          </label>
          <input
            type="text"
            placeholder="e.g. Computer Science"
            value={profile.intended_major ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, intended_major: e.target.value }))}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Target Schools
          </label>
          <textarea
            rows={3}
            placeholder="e.g. MIT, University of Michigan, Arizona State University"
            value={profile.target_schools ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, target_schools: e.target.value }))}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Country of Origin
          </label>
          <input
            type="text"
            placeholder="e.g. Nepal"
            value={profile.country_of_origin ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, country_of_origin: e.target.value }))}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving} className="bg-black text-white hover:bg-neutral-800 disabled:opacity-50">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400">
              Profile saved successfully.
            </span>
          )}
          {error && (
            <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
          )}
        </div>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const activeView: DashboardView = useMemo(() => {
    const view = searchParams.get("view");
    if (view === "agent") return "agent";
    if (view === "profile") return "profile";
    return "information";
  }, [searchParams]);

  const links = [
    {
      label: "Information",
      href: "/dashboard?view=information",
      icon: <Info className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Agent",
      href: "/dashboard?view=agent",
      icon: <Bot className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Profile",
      href: "/dashboard?view=profile",
      icon: <User className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  return (
    <div
      className={cn(
        "dashboard-fullbleed flex w-full flex-col overflow-hidden border-y border-neutral-200 bg-gray-100 shadow-sm md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-8">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <DashboardLogo /> : <DashboardLogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              <SidebarLink
                link={{
                  label: "Dashboard",
                  href: "/dashboard?view=information",
                  icon: (
                    <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
                  ),
                }}
              />
              {links.map((link) => (
                <SidebarLink
                  key={link.label}
                  link={link}
                  className={cn(
                    activeView === link.label.toLowerCase()
                      ? "rounded-md bg-neutral-200/80 px-2 dark:bg-neutral-700/70"
                      : "",
                  )}
                />
              ))}
            </div>
          </div>

        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full overflow-y-auto rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-8 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {activeView === "information" && "Application Information Hub"}
              {activeView === "agent" && "AI Agent Assistant"}
              {activeView === "profile" && "Your Profile"}
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {activeView === "information" && "Read focused guides and practical advice for college applications, exam planning, and visa preparation."}
              {activeView === "agent" && "Ask targeted questions and get structured guidance for your next application move."}
              {activeView === "profile" && "Save your academic details so the AI agent can give you personalized advice."}
            </p>
          </div>

          {activeView === "information" && <InformationView />}
          {activeView === "agent" && <AgentView />}
          {activeView === "profile" && <ProfileView />}
        </motion.div>
      </div>
    </div>
  );
}
