import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import logger from "../config/logger.config";
import TurndownService from "turndown";

export async function sanitizeMarkdown(markdown: string): Promise<string> {
    
    if(!markdown || typeof markdown !== "string") {
        return "";
    }

    try {
        const convertedHtml = await marked.parse(markdown);

        const sanitizedHtml = sanitizeHtml(convertedHtml, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'pre', 'code']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                a: ["href", "target"],
                img: ["src", "alt", "title"],
                pre: ["class"],
                code: ["class"],
            },
            allowedSchemes: ["http", "https"],
            allowedSchemesByTag: {
                img: ["http", "https"],
            },
            
        });
        
        const tds = new TurndownService();
        return tds.turndown(sanitizedHtml);
        
    } catch (error) {
        logger.error("Error sanitizing the markdown", error);
        return "";
    }
}