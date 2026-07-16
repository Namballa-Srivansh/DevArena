"use client";

import { useState } from "react";
import { Search, Trophy, LayoutGrid, AlertCircle, RefreshCw } from "lucide-react";
import { IProblem } from "@/app/actions";
import ChallengeCard from "@/components/challenge-card";
import { cn } from "@/lib/utils";

interface ArenaLobbyClientProps {
  initialChallenges: IProblem[];
}

export default function ArenaLobbyClient({ initialChallenges }: ArenaLobbyClientProps) {
  const [challenges, setChallenges] = useState<IProblem[]>(initialChallenges);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter criteria
  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty === "All" || c.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Pull latest updates from backend
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { getProblems } = await import("@/app/actions");
      const freshData = await getProblems();
      setChallenges(freshData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">Problems</h1>
          <p className="text-zinc-500 text-sm mt-1">Select a coding challenge and start solving.</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-650 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search challenges by title/description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-colors shadow-sm"
          />
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Easy", "Medium", "Hard"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={cn(
                "rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm",
                difficulty === level
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600 font-bold"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-350 hover:text-zinc-800"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 mb-4 text-zinc-450">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-zinc-700 text-base">No Challenges Found</h3>
          <p className="text-zinc-450 text-xs mt-1 max-w-xs mx-auto">
            Try adjusting your search criteria or difficulty filters, or create a new challenge!
          </p>
        </div>
      )}
    </div>
  );
}
