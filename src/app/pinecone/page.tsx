'use client';

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea'
import { Database, LucideLoader2, MoveUp, RefreshCcw } from 'lucide-react'
import { useCallback, useState } from 'react'

const VectorDBPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [indexName, setIndexName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);

  const onUploadStart = useCallback(async () => {
    setProgress(0);
    setFileName('');
    setIsLoading(true);
    const response = await fetch('/api/updateDatabase', {
      method: 'POST',
      body: JSON.stringify({
        indexName,
        namespace,
      })
    });
    console.log(response);
    await processStreamedProgress(response);
    
    setIsLoading(false);
  }, [indexName, namespace]);
  
  async function processStreamedProgress(response: Response) {
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('No reader found');
      return;
    }
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsLoading(false);
          break;
        }
        const data = new TextDecoder().decode(value);
        console.log(data);
      }
    } catch (error) {
      console.error("Stream processing error:", error);
    }
  };

  return (
    <main className='flex flex-col min-h-screen items-center justify-center p-24'>
      <Card>
        <CardHeader>
          <CardTitle>Update Knowledge Base</CardTitle>
          <CardDescription>Add new documents to your vector DB</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
            <div className="col-span-2 grid gap-4 border rounded-lg p-6">
              <div className='gap-2 flex flex-col relative'>
                <Button className='absolute -top-4 -right-4' variant={'ghost'} size={'icon'}>
                  <RefreshCcw />
                </Button>
                <Label>Files List:</Label>
                <Textarea readOnly className='resize-none min-h-24 border p-3 shadow-none disabled:cursor-not-allowed focus-visible:ring-0 text-sm text-muted-foreground'/>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className="grid gap-2">
                  <Label>
                    Index Name
                  </Label>
                  <Input value={indexName} onChange={e => setIndexName(e.target.value)} placeholder="index name" disabled={isLoading} className='disabled:cursor-not-allowed'/>
                </div>
                <div className="grid gap-2">
                  <Label>
                    Namespace
                  </Label>
                  <Input value={namespace} onChange={e => setNamespace(e.target.value)} placeholder="namespace" disabled={isLoading} className='disabled:cursor-not-allowed'/>
                </div>
              </div>
            </div>
            <Button onClick={onUploadStart} variant={"ghost"} className="w-full h-full cursor-pointer disabled:cursor-not-allowed p-8" disabled={isLoading} >
              <span className='flex flex-row'>
                <Database className='size-12 stroke-red-800'/>
                <MoveUp className='size-6 stroke-red-800'/>
              </span>
            </Button>
          </div>
          {isLoading && (
            <div className='mt-4'>
              <Label>File Name: {fileName}</Label>
              <div className='flex flex-row items-center gap-4'>
                <Progress value={progress} className=''/>
                <LucideLoader2 className='stroke-red-800 animate-spin'/>
              </div>
            </div>
            )
          }
        </CardContent>
      </Card>
    </main>
  )
}

export default VectorDBPage

