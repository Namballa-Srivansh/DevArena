import Link from "next/link";
import { Swords, Trophy, Sparkles, Terminal, Activity, Brain } from "lucide-react";
import { getProblems } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const problems = await getProblems();
  const totalProblemsCount = problems.length;

  // Mock stats
  const solvedCount = Math.min(Math.round(totalProblemsCount * 0.4), totalProblemsCount);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-r from-indigo-50/50 via-indigo-50/20 to-white p-8 sm:p-12 mb-8 shadow-sm">
        <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-100">
            <Sparkles className="h-3.5 w-3.5" />
            Arena Season 1 Active
          </div>
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight text-zinc-900">
            Welcome to the <span className="text-indigo-600">DevArena</span>
          </h1>
          <p className="text-zinc-650 text-sm sm:text-base leading-relaxed">
            Hone your programming prowess, draft algorithms, and compete in standard compiler challenges. Write solutions in Python or C++ and witness real-time evaluations in isolated sandboxes.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/arena"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Swords className="h-4 w-4" />
              Browse Problems
            </Link>
            <Link
              href="/admin/create-challenge"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-900 shadow-sm"
            >
              <Terminal className="h-4 w-4" />
              Create Custom Problem
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Stats and Panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Telemetry Stats Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Arena Stats</h3>
              <Activity className="h-4 w-4 text-indigo-600" />
            </div>

            <div className="space-y-4">
              {/* Progress Bar: Solved */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500 font-medium">Challenges Solved</span>
                  <span className="text-zinc-800 font-bold">{solvedCount} / {totalProblemsCount}</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${totalProblemsCount > 0 ? (solvedCount / totalProblemsCount) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Accuracy Meter */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500 font-medium">Accuracy Index</span>
                  <span className="text-emerald-600 font-bold">78.4%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "78.4%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-4 mt-6 flex justify-between text-xs text-zinc-400">
            <span>Easy: <b className="text-emerald-600">Green</b></span>
            <span>Medium: <b className="text-amber-600">Yellow</b></span>
            <span>Hard: <b className="text-rose-600">Red</b></span>
          </div>
        </div>

        {/* Forge Hub Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Problem Creator</h3>
              <Brain className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              Create coding puzzles with customized input/output test suites. Your custom challenges will appear instantly inside the Problems list.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100">
            <Link
              href="/admin/create-challenge"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 hover:border-indigo-500 bg-zinc-50 hover:bg-indigo-50/30 py-2.5 text-xs font-bold text-zinc-650 hover:text-indigo-600 transition-all shadow-sm"
            >
              Create a Problem
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
