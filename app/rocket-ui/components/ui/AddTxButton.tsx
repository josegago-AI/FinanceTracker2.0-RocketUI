'use client'
import { Plus } from 'lucide-react'

export default function AddTxButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevation-2 hover:shadow-elevation-3 transition grid place-items-center z-50"
      aria-label="Add transaction"
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}