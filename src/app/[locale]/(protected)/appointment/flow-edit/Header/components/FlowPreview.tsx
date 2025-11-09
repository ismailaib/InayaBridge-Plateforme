import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/Badge'

type Field = {
  name: string
  label: string
  type: string
}

type Section = {
  title: string
  fields: Field[]
}

type Schema = {
  description?: string
  sections: Section[]
}

export default function FlowPreview({ schema }: { schema: Schema }) {
  const nodes = schema.sections || []

  if (!nodes.length) {
    return (
      <div className="w-full h-20 flex items-center justify-center text-sm text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 bg-[radial-gradient(theme(colors.gray.200),transparent_1px)] dark:bg-[radial-gradient(theme(colors.gray.700),transparent_1px)] bg-[size:12px_12px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <span>Empty Flow</span>
        </div>
      </div>
    )
  }

  const maxVisible = 4
  const visibleNodes = nodes.slice(0, maxVisible)
  const remainingCount = nodes.length - maxVisible

  return (
    <div className="w-full h-full bg-white dark:bg-gray-950 dark:border-gray-800 p-3 overflow-hidden bg-[radial-gradient(theme(colors.gray.200),transparent_1px)] dark:bg-[radial-gradient(theme(colors.gray.700),transparent_1px)] bg-[size:12px_12px]">
      <div className="flex items-center gap-2 h-full">
        <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
          {visibleNodes.map((node, i) => (
            <React.Fragment key={i}>
              <Badge
                variant="neutral"
              >
                {node.title.length > 10 ? node.title.slice(0, 10) + '…' : node.title}
              </Badge>
              {i < visibleNodes.length - 1 && (
                <svg width="8" height="8" viewBox="0 0 8 8" className="flex-shrink-0">
                  <path d="M 0 4 L 8 4" stroke="#d1d5db" strokeWidth="1.5" />
                  <polygon points="6,2 8,4 6,6" fill="#d1d5db" />
                </svg>
              )}
            </React.Fragment>
          ))}
          
          {remainingCount > 0 && (
            <>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              </div>
              <div className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-500 font-medium flex-shrink-0">
                +{remainingCount}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
