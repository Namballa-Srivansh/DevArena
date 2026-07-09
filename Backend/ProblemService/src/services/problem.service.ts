import sanitize from "sanitize-html";
import { CreateProblemDto, UpdateProblemDto } from "../dtos/problem.dto";
import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repositories/problem.repository";
import { BadRequestError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/markdown.sanitize";

export interface IProblemService {
    createProblem(problem: CreateProblemDto): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblems(): Promise<{ problems: IProblem[]; total: number }>;
    updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(difficulty: "Easy" | "Medium" | "Hard"): Promise<IProblem[]>
    searchProblems(query: string): Promise<IProblem[]>
}

export class ProblemService implements IProblemService {

    private problemRepository: IProblemRepository;

    constructor(problemRepository: IProblemRepository) {
        this.problemRepository = problemRepository;
    }

    async createProblem(problem: CreateProblemDto): Promise<IProblem> {
        const sanitizePayload = {
            ...problem,
            description: await sanitize(problem.description),
            editorial: problem.editorial && await sanitize(problem.editorial),
        }
        return this.problemRepository.createProblem(sanitizePayload);
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem){
            throw new Error("Problem not found");
        }
        return problem;
    }

    async getAllProblems(): Promise<{ problems: IProblem[]; total: number }> {
        return this.problemRepository.getAllProblems();
    }

    async updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem){
            throw new Error("Problem not found");
        }

        const sanitizePayload: Partial<IProblem> = {
            ...updateData,
        }
        if(updateData.description) {
            sanitizePayload.description = await sanitizeMarkdown(updateData.description)
        }
        
        if(updateData.editorial) {
            sanitizePayload.editorial = await sanitizeMarkdown(updateData.editorial)
        }

        return this.problemRepository.updateProblem(id, sanitizePayload);
    }

    async deleteProblem(id: string): Promise<boolean> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem){
            throw new Error("Problem not found");
        }
        return this.problemRepository.deleteProblem(id);
    }

    async findByDifficulty(difficulty: "Easy" | "Medium" | "Hard"): Promise<IProblem[]> {
        return this.problemRepository.findByDifficulty(difficulty);
    }

    async searchProblems(query: string): Promise<IProblem[]> {
        if(!query || query.trim() === "") {
            throw new BadRequestError("Query is Rquired")
        }
        return this.problemRepository.searchProblems(query);
    }
}