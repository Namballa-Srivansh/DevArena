"use client";

import { useState } from "react";
import { FileText, HelpCircle, BookOpen } from "lucide-react";
import { IProblem } from "@/app/actions";
import { cn } from "@/lib/utils";

interface WorkspaceTabsProps {
  challenge: IProblem;
}

export default function WorkspaceTabs({ challenge }: WorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "editorial">("description");

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Tabs list */}
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2">
        <button
          onClick={() => setActiveTab("description")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all active:scale-95",
            activeTab === "description"
              ? "bg-white text-indigo-600 border border-zinc-200 shadow-sm"
              : "text-zinc-550 hover:text-zinc-800"
          )}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Description
        </button>

        <button
          onClick={() => setActiveTab("editorial")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all active:scale-95",
            activeTab === "editorial"
              ? "bg-white text-indigo-600 border border-zinc-200 shadow-sm"
              : "text-zinc-555 hover:text-zinc-800"
          )}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Editorial
        </button>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 select-text bg-white">
        {activeTab === "description" ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{challenge.title}</h1>
              <span className="text-[10px] text-zinc-400 font-mono">
                ID: {challenge.id}
              </span>
            </div>

            {/* Description Text */}
            <div className="text-sm leading-relaxed text-zinc-650 space-y-4 whitespace-pre-wrap font-sans">
              {challenge.description}
            </div>

            {/* Examples cases */}
            {challenge.testCases && challenge.testCases.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Example Runs</h3>
                
                <div className="space-y-4">
                  {challenge.testCases.slice(0, 3).map((testcase, idx) => (
                    <div key={testcase._id || idx} className="space-y-2">
                      <h4 className="text-xs font-semibold text-zinc-400">Case {idx + 1}</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Input Box */}
                        <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3">
                          <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider mb-1">Input</p>
                          <pre className="text-xs text-zinc-700 font-mono whitespace-pre-wrap">{testcase.input}</pre>
                        </div>
                        {/* Expected Output Box */}
                        <div className="rounded-lg bg-indigo-50/20 border border-indigo-100/50 p-3">
                          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Expected Output</p>
                          <pre className="text-xs text-indigo-600 font-mono whitespace-pre-wrap">{testcase.output}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Editorial & Walkthrough</h2>
            
            {challenge.editorial ? (
              <div className="text-sm leading-relaxed text-zinc-650 whitespace-pre-wrap font-sans">
                {challenge.editorial}
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center">
                <p className="text-xs text-zinc-450">
                  No editorial document has been drafted for this challenge yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
