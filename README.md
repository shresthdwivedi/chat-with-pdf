# Chat with PDF

A TypeScript-powered web application that enables users to interact with PDF documents through a chat-based interface.

## Description

Chat with PDF allows users to upload PDF files and query their contents interactively. The project utilizes advanced LLMs to extract, process, and provide meaningful responses based on the PDF content. Built with Next.js, LangChain, and PineconeDB, the app ensures efficient document processing and retrieval-augmented generation (RAG) for precise answers.

## Table of Contents

- [LLMs Used](#llms-used)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## 🤖 LLMs Used

This project utilizes **two Large Language Models (LLMs)** for different tasks:  

### 1️⃣ **Gemini-2.0-Flash**
- **Usage**: Used for answering user queries based on the PDF content.  
- **Provider**: Google AI.  
 
### 2️⃣ **mxbai-embed-large-v1**
- **Homepage**: [Hugging Face - mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1)  
- **Usage**: Converts PDF text into vector embeddings for efficient storage and retrieval.  
- **Provider**: MixedBread AI.  

## Installation

Follow these steps to set up the project:

1. Clone the repository:
   ```sh
   git clone https://github.com/shresthdwivedi/chat-with-pdf.git
   ```
2. Navigate to the project directory:
   ```sh
   cd chat-with-pdf
   ```
3. Install the dependencies:
   ```sh
   pnpm install
   ```

## Usage

To start the application, run:

```sh
pnpm start
```

Then, open your browser and navigate to `http://localhost:3000` to begin interacting with PDFs.

## Features

- Chat with PDF: Upload a PDF and ask questions about its content.
- Efficient Embeddings: Uses mxbai-embed-large-v1 from Hugging Face for document embedding.
- Fast Query Response: Utilizes Gemini-2.0-Flash for answering user queries.
- Scalable Vector Storage: Uses Pinecone DB for storing and retrieving embeddings.
- Modern Tech Stack: Built with Next.js, TypeScript, and Tailwind CSS.


