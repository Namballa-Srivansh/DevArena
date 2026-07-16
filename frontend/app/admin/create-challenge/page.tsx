"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2, Sparkles, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { createProblem, ITestcase } from "@/app/actions";
import { cn } from "@/lib/utils";

export default function CreateChallenge() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [editorial, setEditorial] = useState("");
  const [testCases, setTestCases] = useState<ITestcase[]>([{ input: "", output: "" }]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Add a new testcase row
  const addTestcase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  // Remove a testcase row
  const removeTestcase = (index: number) => {
    if (testCases.length === 1) return;
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  // Update testcase details
  const updateTestcase = (index: number, field: "input" | "output", value: string) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  // Submit challenge creation form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage(null);

    // Basic validation
    if (!title.trim() || !description.trim()) {
      setMessage({ type: "error", text: "Title and description are required." });
      setIsSubmitting(false);
      return;
    }

    // Verify testcases
    const validTestcases = testCases.filter((tc) => tc.input.trim() !== "" || tc.output.trim() !== "");
    if (validTestcases.length === 0) {
      setMessage({ type: "error", text: "At least one valid test case is required." });
      setIsSubmitting(false);
      return;
    }

    const result = await createProblem({
      title: title.trim(),
      description: description.trim(),
      difficulty,
      editorial: editorial.trim() || undefined,
      testCases: validTestcases,
    });

    if (result.success) {
      setMessage({ type: "success", text: "Problem created successfully! Redirecting to Problems..." });
      setTimeout(() => {
        router.push("/arena");
      }, 2000);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to forge challenge." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 select-text">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-zinc-200 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
          <PlusCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">Forge Challenge</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Craft custom programming battles and deploy them to the active Arena.</p>
        </div>
      </div>

      {/* Alert message */}
      {message && (
        <div
          className={cn(
            "rounded-xl border p-4 mb-6 flex items-start gap-3 text-sm",
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          )}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Challenge Title</label>
            <input
              type="text"
              placeholder="e.g., Reverse Linked List"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-colors shadow-sm"
            />
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Difficulty Grade</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-colors shadow-sm"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Description / Instructions</label>
          <textarea
            placeholder="Write challenge descriptions here. Markdown formatting is supported..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-colors resize-y font-sans shadow-sm"
          />
        </div>

        {/* Editorial */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Editorial Solution <span className="text-[10px] text-zinc-400 lowercase font-semibold">(optional)</span>
          </label>
          <textarea
            placeholder="Describe the optimal solution or algorithm explanation..."
            value={editorial}
            onChange={(e) => setEditorial(e.target.value)}
            rows={4}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-colors resize-y font-sans shadow-sm"
          />
        </div>

        {/* Test Cases */}
        <div className="space-y-4 pt-6 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Compiler Test Cases</label>
            <button
              type="button"
              onClick={addTestcase}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 hover:border-indigo-500 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-all active:scale-95 shadow-sm"
            >
              Add Test Case
            </button>
          </div>

          <div className="space-y-4">
            {testCases.map((tc, idx) => (
              <div key={idx} className="group relative rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 space-y-4 shadow-sm hover:border-zinc-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">Test Case #{idx + 1}</span>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestcase(idx)}
                      className="text-zinc-400 hover:text-rose-600 transition-colors p-1 rounded hover:bg-zinc-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 font-mono">
                  {/* Input */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Standard Input</span>
                    <textarea
                      placeholder="Input data (e.g., [1, 2, 3, 4] or 5)"
                      value={tc.input}
                      onChange={(e) => updateTestcase(idx, "input", e.target.value)}
                      rows={2}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Output */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Expected Output</span>
                    <textarea
                      placeholder="Expected stdout (e.g., [4, 3, 2, 1] or 25)"
                      value={tc.output}
                      onChange={(e) => updateTestcase(idx, "output", e.target.value)}
                      rows={2}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-zinc-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deploying Vector...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Forge and Deploy Challenge
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
