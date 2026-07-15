import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Info, HelpCircle, FileText } from "lucide-react";
import { getProblemById } from "@/app/actions";
import CodeEditor from "@/components/code-editor";
import WorkspaceTabs from "@/components/workspace-tabs";

interface WorkspaceProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ArenaWorkspace({ params }: WorkspaceProps) {
  const { id } = await params;
  const challenge = await getProblemById(id);

  if (!challenge) {
    notFound();
  }

  const difficultyColors = {
    Easy: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Medium: "bg-amber-50 text-amber-600 border-amber-200",
    Hard: "bg-rose-50 text-rose-600 border-rose-200",
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-4rem)]">
      {/* Workspace Header */}
      <div className="border-b border-zinc-200 bg-white px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/arena"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-all active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <span className="text-zinc-300 font-medium">/</span>
          <h2 className="text-sm font-bold text-zinc-850 tracking-wide truncate max-w-xs sm:max-w-md">
            {challenge.title}
          </h2>
          <span className="text-zinc-300 font-medium">/</span>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
              difficultyColors[challenge.difficulty]
            }`}
          >
            {challenge.difficulty}
          </span>
        </div>
      </div>

      {/* Workspace Arena Panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-250 overflow-hidden">
        {/* Left Side: Challenge details scrollable */}
        <div className="flex flex-col overflow-hidden bg-white">
          <WorkspaceTabs challenge={challenge} />
        </div>

        {/* Right Side: Interactive Editor Workspace */}
        <div className="flex flex-col p-4 bg-zinc-50 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CodeEditor problemId={challenge.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
