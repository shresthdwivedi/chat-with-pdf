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
  const loader = new DirectoryLoader('./documents', {
    '.pdf': (path: string) =>{ 
      return new PDFLoader(path, {
      splitPages: false,
    })},
    '.txt': (path: string) => new TextLoader(path),
  })

  const docs = await loader.load();
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  })

  let response = null;

  await updateVectorDB(client, indexName, namespace, docs, (fileName, totalChunks, chunksUpserted, isComplete) => {
    if (!isComplete) {
      response = NextResponse.json({
        fileName,
        totalChunks,
        chunksUpserted,
        isComplete
      })
    }
  });

  return response || NextResponse.json({ message: "Upload completed" });

}
