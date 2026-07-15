"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, AlertCircle, ArrowUpRight, Cpu } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FlatSubmission {
  id: string;
  problemId: string;
  code: string;
  language: "cpp" | "python";
  status: "pending" | "compiling" | "running" | "accepted" | "wrong_answer";
  createdAt: string;
  updatedAt: string;
  problemTitle: string;
}

interface SubmissionsTableClientProps {
  initialSubmissions: FlatSubmission[];
}

export default function SubmissionsTableClient({ initialSubmissions }: SubmissionsTableClientProps) {
  const [submissions] = useState<FlatSubmission[]>(initialSubmissions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [langFilter, setLangFilter] = useState<string>("All");

  const filtered = submissions.filter((sub) => {
    const matchesSearch = sub.problemTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
    const matchesLang = langFilter === "All" || sub.language === langFilter;
    return matchesSearch && matchesStatus && matchesLang;
  });

  const statusBadges = {
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    wrong_answer: "bg-rose-55 text-rose-700 border-rose-200/80",
    pending: "bg-zinc-100 text-zinc-600 border-zinc-200",
    compiling: "bg-indigo-50 text-indigo-705 border-indigo-100",
    running: "bg-indigo-50 text-indigo-705 border-indigo-100",
  };

  return (
    <div className="space-y-6">
      {/* Filtering Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-450" />
          <input
            type="text"
            placeholder="Search by challenge name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-colors shadow-sm"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 outline-none focus:border-indigo-500 transition-colors shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="accepted">Accepted</option>
            <option value="wrong_answer">Wrong Answer</option>
            <option value="compiling">Compiling</option>
            <option value="running">Running</option>
            <option value="pending">Pending</option>
          </select>

          {/* Language filter */}
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 outline-none focus:border-indigo-500 transition-colors shadow-sm"
          >
            <option value="All">All Languages</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-205 bg-zinc-50/70 text-xs font-bold uppercase tracking-wider text-zinc-450">
              <th className="px-6 py-4">Submission ID</th>
              <th className="px-6 py-4">Challenge</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
            {filtered.length > 0 ? (
              filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-zinc-50/40 transition-colors duration-150">
                  <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                    {sub.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 font-semibold text-zinc-800">
                    {sub.problemTitle}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 font-mono uppercase">
                      <Cpu className="h-3.5 w-3.5 text-indigo-500" />
                      {sub.language}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                        statusBadges[sub.status] || statusBadges.pending
                      )}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400">
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/arena/${sub.problemId}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-755 transition-colors"
                    >
                      Workspace
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-450">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-5 w-5 text-zinc-350" />
                    <p className="text-xs">No records matching query found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
