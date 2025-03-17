import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Pinecone } from "@pinecone-database/pinecone";
import { updateVectorDB } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
  try {
    const { indexName, namespace } = await req.json();
    const response = await handleUpload(indexName, namespace);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

async function handleUpload(indexName: string, namespace: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const loader = new DirectoryLoader('./documents', {
        '.pdf': (path: string) => new PDFLoader(path, { splitPages: false }),
        '.txt': (path: string) => new TextLoader(path),
      });

      const docs = await loader.load();
      const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

      await updateVectorDB(client, indexName, namespace, docs, (fileName, totalChunks, chunksUpserted, isComplete) => {
        const chunkData = `${fileName}-${totalChunks}-${chunksUpserted}-${isComplete}`;
        console.log(chunkData); // ✅ This should now be logged on the frontend!

        // Push data to stream
        controller.enqueue(encoder.encode(chunkData));
        
        if (isComplete) {
          controller.close();
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
}

