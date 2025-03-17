'use client';

import { Message } from 'ai';
import React from 'react'
import MessageBox from './messageBox';

type Props = {
  messages: Message[];
  isLoading: boolean;
}

const Messages = ({ messages, isLoading }: Props) => {
  return (
    <div className='flex flex-col gap-4'>
      {messages.map((m, index)=>{
        return <MessageBox key={index} role={m.role} content={m.content} />
      })}
    </div>
  )
}

export default Messages