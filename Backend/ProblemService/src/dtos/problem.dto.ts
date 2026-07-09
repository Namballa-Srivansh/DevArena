import { ITestcase } from "../models/problem.model";

export interface CreateProblemDto {
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    editorial?: string;
    testCases: ITestcase[];
}

export interface UpdateProblemDto {
    title?: string;
    description?: string;
    difficulty?: "Easy" | "Medium" | "Hard";
    editorial?: string;
    testCases?: ITestcase[];
}

