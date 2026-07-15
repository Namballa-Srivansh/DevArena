import Link from "next/link";
import { Trophy, Clock, CheckCircle2, XCircle, ArrowRight, Eye, Cpu } from "lucide-react";
import { getProblems, getSubmissionsForProblem, ISubmission, IProblem } from "@/app/actions";
import { formatDate } from "@/lib/utils";
import SubmissionsTableClient from "@/components/submissions-table-client";

export const dynamic = "force-dynamic";

interface FlatSubmission extends ISubmission {
  problemTitle: string;
}

export default async function SubmissionsLog() {
  const problems = await getProblems();

  // Concurrently query submissions for all problems
  const submissionsPromises = problems.map(async (problem) => {
    const subs = await getSubmissionsForProblem(problem.id);
    return subs.map((sub) => ({
      ...sub,
      problemTitle: problem.title,
    }));
  });

  const submissionsNested = await Promise.all(submissionsPromises);
  const allSubmissions: FlatSubmission[] = submissionsNested
    .flat()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-zinc-200 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">Gladiator Audit Trail</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Historical ledger of all compiled telemetry payloads within DevArena.</p>
        </div>
      </div>

      {/* Submissions Table Client component */}
      <SubmissionsTableClient initialSubmissions={allSubmissions} />
    </div>
  );
}
