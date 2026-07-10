import { model, Schema, Document } from "mongoose";

export enum SubmissionStatus {
    PENDING = "pending",
    COMPILING = "compiling",
    RUNNING = "running",
    ACCEPTED = "accepted",
    WRONG_ANSWER = "wrong_answer",
}

export enum SubmissionLanguage {
    CPP = "cpp",
    PYTHON = "python",
}

export interface ISubmission extends Document {
    id: string;
    problemId: string;
    code: string;
    language: SubmissionLanguage;
    status: SubmissionStatus;
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
    problemId: {
        type: String,
        required: [true, "Problem Id required for the submission"],
    },
    code: {
        type: String,
        required: [true, "Code is required for evaluation"],
    },
    language: {
        type: String,
        enum: Object.values(SubmissionLanguage),
        required: [true, "Language is required for evaluation"]
    },
    status: {
        type: String,
        enum: Object.values(SubmissionStatus),
        default: SubmissionStatus.PENDING,
    },

}, { 
    timestamps: true ,
    toJSON: {
        transform: (_, record: Record<string, any>) => {
            delete record.__v;
            record.id = record._id;
            delete record._id;
            return record;
        }
    }
});

submissionSchema.index({ status: 1, createdAt: -1 })

export const Submission = model<ISubmission>("Submission", submissionSchema);
