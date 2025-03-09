import { Pinecone } from "@pinecone-database/pinecone"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Document } from "langchain/document"
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

  

}
