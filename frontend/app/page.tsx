import { DemoHeroGeometric } from "@/components/ui/demo";

export default function HomePage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="relative left-1/2 -mt-8 w-screen -translate-x-1/2">
        <DemoHeroGeometric />
      </div>

      <section className="card">
        <h2>About CollegeSodhpuch</h2>
        <p>
          CollegeSodhpuch brings your study abroad journey into one clear system. You can
          understand university applications, organize documents, and prepare for visa procedures
          without jumping between scattered sources.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <h3>College Discovery</h3>
          <p>Compare options, shortlist programs, and build a smart application plan.</p>
        </article>
        <article className="card">
          <h3>Application Workflow</h3>
          <p>Track requirements, deadlines, and progress so nothing gets missed.</p>
        </article>
        <article className="card">
          <h3>Visa Preparation</h3>
          <p>Follow step-by-step guidance for documents, interview prep, and timing.</p>
        </article>
      </section>
    </div>
  );
}
