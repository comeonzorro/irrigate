import Link from "next/link";

const PLANNER_TOOLS = [
  {
    href: "/compte/materiel",
    emoji: "🛠️",
    title: "Inventaire",
    description: "Matériel déjà possédé",
  },
  {
    href: "/compost",
    emoji: "♻️",
    title: "Compost",
    description: "Pas-à-pas fabrication",
  },
  {
    href: "/calendrier",
    emoji: "📅",
    title: "Calendrier",
    description: "Semis & récoltes",
  },
  {
    href: "/compte/journal",
    emoji: "📓",
    title: "Journal",
    description: "Suivi du potager",
  },
] as const;

export function PlannerToolTiles() {
  return (
    <section
      aria-labelledby="planner-tools-heading"
      className="mb-6 rounded-2xl border border-emerald-200/70 bg-white/90 p-4 shadow-sm backdrop-blur"
    >
      <h2
        id="planner-tools-heading"
        className="text-sm font-semibold uppercase tracking-wide text-emerald-600"
      >
        Outils potager
      </h2>
      <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PLANNER_TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="flex h-full flex-col rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 transition hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-sm"
            >
              <span className="text-2xl" aria-hidden="true">
                {tool.emoji}
              </span>
              <span className="mt-2 font-semibold text-emerald-950">
                {tool.title}
              </span>
              <span className="mt-0.5 text-xs text-emerald-700">
                {tool.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
