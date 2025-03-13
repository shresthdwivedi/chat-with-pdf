import { Pinecone, PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Document } from "langchain/document"
import { FeatureExtractionPipeline, pipeline } from "@huggingface/transformers"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { batchSize } from "./config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function updateVectorDB (
  client: Pinecone,
  indexName: string,
  namespace: string,
  docs: Document[],
  progressCallback: (fileName: string, totalChunks: number, chunksUpserted: number, isComplete: boolean) => void,  
) {
  const modelname = 'mixedbread-ai/mxbai-embed-large-v1';
  const extractor = await pipeline('feature-extraction', modelname, {
    dtype: "fp32",
  });

  console.log(extractor);
  for (const doc of docs) {
    await processDocument(client, indexName, namespace, doc, extractor);
  }
}

async function processDocument(
  client: Pinecone, 
  indexName: string, 
  namespace: string, 
  doc: Document<Record<string, any>>, 
  extractor: FeatureExtractionPipeline,
) {
  const splitter = new RecursiveCharacterTextSplitter();
  const documentChunks = await splitter.splitText(doc.pageContent);
  const fileName = getFileName(doc.metadata.source);
  
  console.log(`Processing ${fileName}, Total Chunks: ${documentChunks.length}`);
  let chunkBatchIndex = 0;

  while (documentChunks.length > 0) {
    chunkBatchIndex++;
    const chunkBatch = documentChunks.splice(0, batchSize);
    await processEachBatch(client, indexName, namespace, fileName, chunkBatch, chunkBatchIndex, extractor);
  }
}

function getFileName (fileName: string): string {
  const docName = fileName.substring(fileName.lastIndexOf('/') + 1);
  return docName.substring(0, docName.lastIndexOf('.')) || docName;
} 

async function processEachBatch(
  client: Pinecone,  
  indexName: string, 
  namespace: string, 
  fileName: string, 
  chunkBatch: string[], 
  chunkBatchIndex: number, 
  extractor: FeatureExtractionPipeline,
) {
  // const output = await extractor(chunkBatch.map(str => str.replace(/\n/g, " ")));

  // console.log(output);
  if (chunkBatch.length === 0) {
    console.warn(`Skipping empty batch at index ${chunkBatchIndex}`);
    return;
  }

  try {
    const output = await extractor(chunkBatch.map(str => str.replace(/\n/g, " ")), {
      pooling: "cls",
    });

    console.log(`Batch ${chunkBatchIndex} output:`, output);

    const embeddingsBatch = output.tolist();
    let vectorBatch: PineconeRecord<RecordMetadata>[] = [];
    for (let i=0; i<chunkBatch.length; i++) {
      const chunk = chunkBatch[i];
      const embedding = embeddingsBatch[i];
      const vector: PineconeRecord<RecordMetadata> = {
        id: `${fileName}-${chunkBatchIndex}-${i}`,
        values: embedding,
        metadata: {
          chunk,
        }
      };
      vectorBatch.push(vector);
    } 

    const index = client.Index(indexName).namespace(namespace);
    await index.upsert(vectorBatch);
    vectorBatch = [];
    
  } catch (error) {
    console.error(`Error processing batch ${chunkBatchIndex}:`, error);
  }
}

