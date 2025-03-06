import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import React from 'react'

type Props = {}

const VectorDBPage = (props: Props) => {
  return (
    <main className='flex flex-col min-h-screen items-center justify-center p-24'>
      <Card>
        <CardHeader>Vector Database</CardHeader>
        <CardDescription>Add new documents to your vector DB</CardDescription>
      </Card>
    </main>
  )
}

export default VectorDBPage