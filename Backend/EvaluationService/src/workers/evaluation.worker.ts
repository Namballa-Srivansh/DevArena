import { Worker } from "bullmq"
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";
import { EvaluationJob } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunner.util";
import { updateSubmission } from "../api/submission.api";
import { LANGUAGE_CONFIG } from "../config/language.config";

async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE, async (job) => {
        logger.info(`Processing job ${job.id}`);
        
        try {
            const { submissionId, code, language, problem } = job.data as EvaluationJob;
            const testCases = problem?.testCases || problem?.testcases;
            
            if (!code || !language || !problem || !testCases) {
                logger.error(`Invalid job payload for job ${job.id}`);
                await updateSubmission(submissionId, "wrong_answer", { error: "Invalid submission data" });
                return;
            }

            const config = LANGUAGE_CONFIG[language];
            if (!config) {
                logger.error(`Unsupported language ${language} for job ${job.id}`);
                await updateSubmission(submissionId, "wrong_answer", { error: `Unsupported language: ${language}` });
                return;
            }

            let responseStatus = "accepted";
            let lastOutput = "";

            for (const testcase of testCases) {
                logger.info(`Running testcase ${testcase._id} for submission ${submissionId}`);
                
                const result = await runCode({
                    code,
                    language,
                    input: testcase.input,
                    timeout: config.timeout,
                    imageName: config.imageName
                });

                if (result.status === "time_limit_exceeded") {
                    responseStatus = "wrong_answer";
                    lastOutput = "Time Limit Exceeded";
                    break;
                }

                if (result.status === "failed") {
                    responseStatus = "wrong_answer";
                    lastOutput = result.output || "Runtime/Compilation Error";
                    break;
                }

                const expectedOutput = testcase.output.trim();
                const actualOutput = result.output ? result.output.trim() : "";

                if (expectedOutput !== actualOutput) {
                    responseStatus = "wrong_answer";
                    lastOutput = `Wrong Answer. Expected: ${expectedOutput}, Got: ${actualOutput}`;
                    break;
                }
            }

            logger.info(`Finished processing job ${job.id} with status: ${responseStatus}`);
            await updateSubmission(submissionId, responseStatus, { output: lastOutput });

        } catch (err: any) {
            logger.error(`Failed to process job ${job.id}: ${err.message}`);
            if (job.data?.submissionId) {
                await updateSubmission(job.data.submissionId, "wrong_answer", { error: err.message || "Internal Evaluation Error" });
            }
            throw err;
        }

    }, {
        connection: createNewRedisConnection()
    });

    worker.on("error", (error) => {
        logger.error(`Evaluation worker error: ${error}`)
    });

    worker.on("completed", (job) => {
        logger.info(`Evaluation job completed: ${job.id}`)
    });

    worker.on("failed", (job, error) => {
        logger.error(`Evaluation job failed: ${job?.id}, error: ${error}`)
    });

}

export async function startWorkers() {
    await setupEvaluationWorker()
}