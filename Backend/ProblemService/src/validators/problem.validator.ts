import {z} from "zod";

export const createProblemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    editorial: z.string().optional(),
    testCases: z.array(z.object({
        input: z.string(),
        output: z.string(),
    })).optional()
});

export const updateProblemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    editorial: z.string().optional(),
    testCases: z.array(z.object({
        input: z.string(),
        output: z.string(),
    })).optional()
});

export const findBydifficultySchema = z.object({
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

export type CreateProblemDto = z.infer<typeof createProblemSchema>;
export type UpdateProblemDto = z.infer<typeof updateProblemSchema>;