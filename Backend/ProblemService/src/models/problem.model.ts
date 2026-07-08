import mongoose from "mongoose";

export interface ITestcase {
    input: string;
    output: string;
}

export interface IProblem extends Document {
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    createdAt: Date;
    updatedAt: Date;
    editorial: string;
    testcases: ITestcase[];
}

const testSchema = new mongoose.Schema<ITestcase>({
    input: { 
            type: String, 
            required: true 
    },
    output: { 
            type: String, 
            required: true 
    }
})

const problemSchema = new mongoose.Schema<IProblem>({
    title: { 
        type: String,
        required: [true, "Title is required"],
        maxlength: [100, "Title cannot exceed 100 characters"],
        trim: true
    },
    description: { 
        type: String, 
        required: [true, "Description is required"],
        trim: true
    },
    difficulty: { 
        type: String, 
        enum: {
            values: ["Easy", "Medium", "Hard"],
            message: "Invalid difficulty level",
        }, 
        required: true, 
        default: "Easy"
    },
    editorial: { 
        type: String, 
        trim: true
    },
    testcases: [testSchema]
}, { timestamps: true })

problemSchema.index({ title: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);