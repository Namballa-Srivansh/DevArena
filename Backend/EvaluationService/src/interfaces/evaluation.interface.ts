export interface TestCase {
    _id: string;
    input: string;
    output: string;
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty?: string;
    diffculty?: string;
    testCases?: TestCase[];
    testcases?: TestCase[];
    createdAt: string;
    updatedAt: string;
}
export interface EvaluationJob {
    submissionId: string;
    code: string;
    language: "python" | "cpp";
    problem: Problem;
}

export interface EvaluationResult {
    status: string;
    output: string | undefined;
}