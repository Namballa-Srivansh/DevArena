import { IProblem, Problem } from "../models/problem.model";

export interface IProblemRepository {
    createProblem( problem: Partial<IProblem>): Promise<IProblem>;
    getProblemById( id:string): Promise<IProblem | null>;
    getAllProblems():Promise<{ problems: IProblem[], total: number}>;
    updateProblem( id:string,updateData:Partial<IProblem>):Promise<IProblem | null>;
    deleteProblem( id:string):Promise<boolean>;
    findByDifficulty( difficulty: "Easy" | "Medium" | "Hard"): Promise<IProblem[]>;
    searchProblems(query:string): Promise<IProblem[]>;
}

export class ProblemRepository implements IProblemRepository {

    constructor() {
        console.log("ProblemRepository constructor called")
    }

    async createProblem( problem: Partial<IProblem>): Promise<IProblem>{
        const newProblem = new Problem(problem);
        await newProblem.save();
        return newProblem;
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        return await Problem.findById(id);
    }

    async getAllProblems(): Promise<{ problems: IProblem[]; total: number; }> {
        const problems = await Problem.find().sort({createAt: -1});
        const total = await Problem.countDocuments();
        return { problems, total };
    }

    async updateProblem(id: string, updateData: Partial<IProblem>): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteProblem(id: string): Promise<boolean> {
        const result = await Problem.findByIdAndDelete(id);
        return result !== null;
    }

    async findByDifficulty(difficulty: "Easy" | "Medium" | "Hard"): Promise<IProblem[]> {
        return await Problem.find({ difficulty }).sort({createAt: -1});
    }

    async searchProblems(query: string): Promise<IProblem[]> {
        return await Problem.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        }).sort({createAt: -1});
    }
}