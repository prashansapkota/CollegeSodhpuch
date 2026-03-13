"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, CornerDownLeft, Info, LayoutDashboard, Mic, Paperclip } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

type DashboardView = "information" | "agent";

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
        <button className="mt-4 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800">
          More &gt;
        </button>
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
        <button className="mt-4 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800">
          More &gt;
        </button>
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
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      role: "agent",
      text: "Hi, I am your CollegeSodhpuch agent. Ask me about college list strategy, SAT prep, application deadlines, or visa steps.",
    },
  ]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const message = value.trim();
    if (!message) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", text: message },
      {
        role: "agent",
        text: "Got it. I can help break this into clear next steps. Start by sharing your GPA, SAT status, and target intake.",
      },
    ]);
    setValue("");
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
        <div className="max-h-[280px] space-y-3 overflow-y-auto pr-1">
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
              {message.text}
            </div>
          ))}
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

          <Button type="submit" size="sm" className="ml-auto gap-1.5 bg-black text-white hover:bg-neutral-800">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
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
    return view === "agent" ? "agent" : "information";
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
              {activeView === "information" ? "Application Information Hub" : "AI Agent Assistant"}
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {activeView === "information"
                ? "Read focused guides and practical advice for college applications, exam planning, and visa preparation."
                : "Ask targeted questions and get structured guidance for your next application move."}
            </p>
          </div>

          {activeView === "information" ? <InformationView /> : <AgentView />}
        </motion.div>
      </div>
    </div>
  );
}
