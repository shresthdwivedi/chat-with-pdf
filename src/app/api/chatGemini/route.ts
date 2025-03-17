import { queryPineconeVectorStore } from "@/lib/utils";
import { Pinecone } from "@pinecone-database/pinecone";
// import { Message, OpenAIStream, StreamData, StreamingTextResponse } from "ai";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Message, StreamData, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;
// export const runtime = 'edge';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? "",
});

const google = createGoogleGenerativeAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.GEMINI_API_KEY
});

const model = google('models/gemini-2.0-flash', {
    safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ],
});

export async function POST(req: Request) {
  const reqBody = await req.json();
  console.log(reqBody);

  const messages: Message[] = reqBody.messages;
  const userQuestion = `${messages[messages.length - 1].content}`;

  // Query the Oxford Handbook of Indian Constitution stored in Pinecone
  const query = `Find relevant constitutional insights for this query:\n\n${userQuestion}`;
  const retrievals = await queryPineconeVectorStore(pinecone, "oxford_constitution", "ns1", query);

  // Construct a final prompt ensuring Gemini relies on retrieved knowledge
  const finalPrompt = `
  You are an expert on Indian constitutional law. Your task is to provide fact-based, legally accurate responses using knowledge from "The Oxford Handbook on the Indian Constitution."
  
  **User Query:** 
  ${userQuestion}
  
  **Relevant Extracts from the Oxford Handbook:**
  ${retrievals}
  
  Use only the provided information to answer. If the query is outside constitutional law, state that explicitly.

  **Answer:**
  `;

  const data = new StreamData();
  data.append({
      retrievals: retrievals,
  });

  const result = await streamText({
      model: model,
      prompt: finalPrompt,
      onFinish() {
          data.close();
      },
  });

  return result.toDataStreamResponse({ data });
}