import {openai} from "@ai-sdk/openai";
import {generateText} from "ai";
import {NextRequest, NextResponse} from "next/server";

import {handleError} from "@/lib/handlers";
import {ValidationError} from "@/lib/http-errors";
import {AIAnswerSchema} from "@/lib/schemas";
import {APIErrorResponse} from "@/types";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const {success, error, data} = AIAnswerSchema.safeParse(body);
    if (!success) throw new ValidationError(error.flatten().fieldErrors);

    const {question, content, userAnswer} = data;

    const {text} = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate a markdown-formatted response to the following question: "${question}".  
      
      Consider the provided context:  
      **Context:** ${content}  
      
      Also, prioritize and incorporate the user's answer when formulating your response:  
      **User's Answer:** ${userAnswer}  
      
      Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point. 
      Provide the final answer in markdown format.
      
      Use everyday language. Keep it short. Don't use h1.`,
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS,  'rust' for Rust, 'go' for Go etc.).",
    });

    return NextResponse.json({success: true, data: text}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};
