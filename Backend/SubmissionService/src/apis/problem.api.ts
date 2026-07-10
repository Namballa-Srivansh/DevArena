import axios, { AxiosResponse } from "axios";
import { serverConfig } from "../config";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export interface ITestcase {
    input: string;
    output: string;
}

export interface IProblemDetails {
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    createdAt: Date;
    updatedAt: Date;
    editorial: string;
    testCases: ITestcase[];
}

export interface IProblemResponse {
    data: IProblemDetails;
    message: string;
    success: boolean;
}

export async function getProblemById(id: string): Promise<IProblemDetails | null>{
    try {
        const response: AxiosResponse<IProblemResponse> = await axios.get(`${serverConfig.PROBLEM_SERVICE}/problems/${id}`)
        
        if(response.data.success) {
            return response.data.data
        }
        throw new InternalServerError("Failed to get problem details")
    } catch (error) {
        logger.error(`Failed to get problem details: ${error}`)
        return null
    }
}