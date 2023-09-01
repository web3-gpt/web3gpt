'use client'

import Image from 'next/image'
import { useChat } from 'ai/react'
import toast from 'react-hot-toast'
import { nanoid } from '@/lib/utils'
import { functionSchemas } from '@/lib/functions/schemas'
import { initialMessages } from '@/app/page'
import { PreviewPromptForm } from './preview-prompt-form'
import { ChatList } from './chat-list'
import { ChatScrollAnchor } from './chat-scroll-anchor'

export function Landing({}) {
  return (
    <div className="mx-auto max-w-2xl px-4 text-center">
      <div className="relative mb-16 mt-24 flex h-8 w-full">
        <Image
          src="/w3gpt_new.svg"
          alt="web3 gpt logo"
          fill
          sizes="(max-width: 318px) 100vw, 318px"
        />
      </div>
      <p className="scroll-m-20 text-2xl tracking-tight">
        Deploy smart contracts with AI
      </p>
    </div>
  )
}
