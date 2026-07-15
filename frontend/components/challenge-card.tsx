import Link from "next/link";
import { Swords, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { IProblem } from "@/app/actions";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  challenge: IProblem;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const difficultyColors = {
    Easy: "bg-emerald-50 text-emerald-600 border-emerald-200/60 hover:bg-emerald-100/50",
    Medium: "bg-amber-50 text-amber-600 border-amber-200/60 hover:bg-amber-100/50",
    Hard: "bg-rose-50 text-rose-600 border-rose-200/60 hover:bg-rose-100/50",
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md shadow-sm">
      {/* Subtle light background glow */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-all duration-300" />
      
      <div className="flex flex-col justify-between h-full space-y-4">
        <div>
          {/* Header row: Difficulty & Editorial */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors duration-200",
                difficultyColors[challenge.difficulty] || difficultyColors.Easy
              )}
            >
              {challenge.difficulty}
            </span>
            
            {challenge.editorial && (
              <span className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
                <FileText className="h-3 w-3 text-indigo-500" />
                Editorial
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/arena/${challenge.id}`}>
            <h3 className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
              {challenge.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="mt-2 text-sm leading-relaxed text-zinc-555 line-clamp-2">
            {challenge.description.replace(/[#*`_]/g, "")}
          </p>
        </div>

        {/* Footer: Date and CTA Button */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <span className="text-xs text-zinc-400">
            Added {new Date(challenge.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>

          <Link
            href={`/arena/${challenge.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/10 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/20 active:scale-95 group-hover:gap-2.5"
          >
            Enter Arena
            <ChevronRight className="h-3.5 w-3.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
