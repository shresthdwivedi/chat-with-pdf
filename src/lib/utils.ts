import { Pinecone } from "@pinecone-database/pinecone"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Document } from "langchain/document"
import { FeatureExtractionPipeline, pipeline } from "@huggingface/transformers"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function updateVectorDB (
  client: Pinecone,
  indexName: String,
  namespace: String,
  docs: Document[],
  progressCallback: (fileName: String, totalChunks: Number, chunksUpserted: Number, isComplete: Boolean) => void,  
) {
  const modelname = 'mixedbread-ai/mxbai-embed-large-v1';
  const extractor = await pipeline('feature-extraction', modelname, {
    dtype: 'fp32',
  });

  console.log(extractor);
  for (const doc of docs) {
    await processDocument(client, indexName, namespace, doc, extractor);
  }
}

async function processDocument(client: Pinecone, indexName: String, namespace: String, doc: Document, extractor: FeatureExtractionPipeline) {
  console.log("this is doc:", doc)
}

