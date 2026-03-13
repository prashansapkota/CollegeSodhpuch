'use client'

import { FC } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

interface Props {
  label: string
  variant?: 'primary' | 'secondary'
  classes?: string
  href?: string
  animate?: boolean
  delay?: number
}

const MotionButton: FC<Props> = ({ label, classes, href }) => {
  const content = (
    <>
      <span
        className='circle bg-primary m-0 block h-12 w-12 overflow-hidden rounded-full duration-500 group-hover:w-full'
        aria-hidden='true'
      ></span>
      <div className='icon absolute top-1/2 left-4 translate-x-0 -translate-y-1/2 duration-500 group-hover:translate-x-[0.4rem]'>
        <ArrowRight className='text-background size-6' />
      </div>
      <span className='button-text text-foreground group-hover:text-background font-manrope absolute top-2/4 left-2/4 ml-4 -translate-x-2/4 -translate-y-2/4 text-center text-lg font-medium tracking-tight whitespace-nowrap duration-500'>
        {label}
      </span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          'bg-background group relative inline-block h-auto w-50 cursor-pointer rounded-full border-[none] p-1 outline-none no-underline',
          classes
        )}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type='button'
      className={cn(
        'bg-background group relative h-auto w-50 cursor-pointer rounded-full border-[none] p-1 outline-none',
        classes
      )}
    >
      {content}
    </button>
  )
}

export default MotionButton
