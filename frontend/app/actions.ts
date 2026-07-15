"use server";

import { revalidatePath } from "next/cache";

const PROBLEM_SERVICE_URL = process.env.PROBLEM_SERVICE_URL || "http://localhost:3000/api/v1";
const SUBMISSION_SERVICE_URL = process.env.SUBMISSION_SERVICE_URL || "http://localhost:3002/api/v1";

export interface ITestcase {
  input: string;
  output: string;
  _id?: string;
}

export interface IProblem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  editorial?: string;
  testCases?: ITestcase[];
  createdAt: string;
  updatedAt: string;
}

export interface ISubmission {
  id: string;
  problemId: string;
  code: string;
  language: "cpp" | "python";
  status: "pending" | "compiling" | "running" | "accepted" | "wrong_answer";
  createdAt: string;
  updatedAt: string;
}

export async function getProblems(): Promise<IProblem[]> {
  try {
    const res = await fetch(`${PROBLEM_SERVICE_URL}/problems`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch problems");
    const json = await res.json();
    return json.success ? (json.data.problems || json.data) : [];
  } catch (error) {
    console.error("Error in getProblems Server Action:", error);
    return [];
  }
}

export async function getProblemById(id: string): Promise<IProblem | null> {
  try {
    const res = await fetch(`${PROBLEM_SERVICE_URL}/problems/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch problem ${id}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`Error in getProblemById Server Action for ID ${id}:`, error);
    return null;
  }
}

export async function createProblem(data: {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  editorial?: string;
  testCases: ITestcase[];
}) {
  try {
    const res = await fetch(`${PROBLEM_SERVICE_URL}/problems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to create problem");
    }
    revalidatePath("/arena");
    return { success: true, data: json.data };
  } catch (error: any) {
    console.error("Error in createProblem Server Action:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProblem(id: string) {
  try {
    const res = await fetch(`${PROBLEM_SERVICE_URL}/problems/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to delete problem");
    }
    revalidatePath("/arena");
    return { success: true };
  } catch (error: any) {
    console.error(`Error in deleteProblem Server Action for ID ${id}:`, error);
    return { success: false, error: error.message };
  }
}

export async function submitCode(submission: {
  problemId: string;
  code: string;
  language: "cpp" | "python";
}) {
  try {
    const res = await fetch(`${SUBMISSION_SERVICE_URL}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to submit code");
    }
    return { success: true, data: json.data as ISubmission };
  } catch (error: any) {
    console.error("Error in submitCode Server Action:", error);
    return { success: false, error: error.message };
  }
}

export async function getSubmissionStatus(id: string): Promise<ISubmission | null> {
  try {
    const res = await fetch(`${SUBMISSION_SERVICE_URL}/submissions/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch submission status for ${id}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`Error in getSubmissionStatus Server Action for ID ${id}:`, error);
    return null;
  }
}

export async function getSubmissionsForProblem(problemId: string): Promise<ISubmission[]> {
  try {
    const res = await fetch(`${SUBMISSION_SERVICE_URL}/submissions/problem/${problemId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch submissions for problem ${problemId}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error(`Error in getSubmissionsForProblem Server Action for problem ID ${problemId}:`, error);
    return [];
  }
}
