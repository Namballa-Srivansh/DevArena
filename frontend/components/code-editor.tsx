"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Code, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { submitCode, getSubmissionStatus, ISubmission } from "@/app/actions";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  problemId: string;
}

const STARTER_CODE = {
  python: `# Write your Python solution here\n\ndef solve():\n    # Implement your logic\n    print("Hello from DevArena")\n\nif __name__ == '__main__':\n    solve()\n`,
  cpp: `// Write your C++ solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Implement your logic\n    cout << "Hello from DevArena" << endl;\n    return 0;\n}\n`,
};

export default function CodeEditor({ problemId }: CodeEditorProps) {
  const [language, setLanguage] = useState<"python" | "cpp">("python");
  const [code, setCode] = useState<string>(STARTER_CODE.python);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<ISubmission | null>(null);
  const [pollingStatus, setPollingStatus] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep starter code updated when language changes
  useEffect(() => {
    setCode(STARTER_CODE[language]);
  }, [language]);

  // Handle Tab key inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd, value } = textarea;
      const newValue = value.substring(0, selectionStart) + "    " + value.substring(selectionEnd);
      setCode(newValue);

      // Reset selection cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 4;
      }, 0);
    }
  };

  // Submit code to backend and poll for status updates
  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmission(null);
    setPollingStatus("Transmitting payload...");

    const result = await submitCode({
      problemId,
      code,
      language,
    });

    if (!result.success || !result.data) {
      setPollingStatus(`Transmission error: ${result.error || "Unknown error"}`);
      setIsSubmitting(false);
      return;
    }

    const sub = result.data;
    setSubmission(sub);
    setPollingStatus("Queued for compilation...");

    // Start polling the status of the submission
    let pollInterval: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max polling time

    pollInterval = setInterval(async () => {
      attempts++;
      const currentSub = await getSubmissionStatus(sub.id);
      
      if (currentSub) {
        setSubmission(currentSub);
        setPollingStatus(`Status: ${currentSub.status.toUpperCase()}`);

        if (
          currentSub.status === "accepted" ||
          currentSub.status === "wrong_answer"
        ) {
          clearInterval(pollInterval);
          setIsSubmitting(false);
        }
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setPollingStatus("Evaluation Timed Out");
        setIsSubmitting(false);
      }
    }, 1500);
  };

  // Generate line numbers
  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-semibold tracking-wide text-zinc-700">Workspace Editor</span>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "python" | "cpp")}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-755 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="python">Python 3</option>
            <option value="cpp">C++ (G++17)</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95",
              isSubmitting
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed border border-zinc-300"
                : "bg-indigo-600 hover:bg-indigo-700"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Submit Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden font-mono text-sm leading-6 relative bg-white">
        {/* Line Numbers */}
        <div className="w-12 bg-zinc-50/50 text-right pr-3 select-none text-zinc-400 border-r border-zinc-200 py-4">
          {lineNumbers.map((num) => (
            <div key={num} className="h-6 leading-6 text-[11px] font-semibold">{num}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-white text-zinc-800 outline-none resize-none overflow-y-auto px-4 py-4 leading-6 border-0 focus:ring-0 select-text h-full whitespace-pre font-mono"
          placeholder="// Write your code here..."
          spellCheck={false}
        />
      </div>

      {/* Console Output Footer */}
      <div className="border-t border-zinc-200 bg-zinc-50 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Arena Telemetry</h4>
        
        {!submission && !pollingStatus && (
          <p className="text-xs text-zinc-500">Your results will show up here after submission.</p>
        )}

        {pollingStatus && !submission && (
          <div className="flex items-center gap-2 text-xs text-zinc-650">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            <span>{pollingStatus}</span>
          </div>
        )}

        {submission && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">Status:</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border",
                  submission.status === "accepted"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : submission.status === "wrong_answer"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                )}
              >
                {submission.status === "accepted" && <CheckCircle className="h-3 w-3" />}
                {submission.status === "wrong_answer" && <XCircle className="h-3 w-3" />}
                {["pending", "compiling", "running"].includes(submission.status) && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {submission.status.toUpperCase()}
              </span>
            </div>

            <div className="rounded-lg bg-white border border-zinc-200 p-3 text-xs text-zinc-700 font-mono">
              <div className="flex justify-between text-zinc-400 mb-1 pb-1 border-b border-zinc-150">
                <span>Metric</span>
                <span>Value</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-450">Language:</span>
                <span className="font-semibold text-zinc-800">{submission.language.toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-450">Submitted at:</span>
                <span className="text-zinc-600">{new Date(submission.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
