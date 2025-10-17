'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { addTransaction } from '@/app/transactions/actions'

export default function AddTransactionModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [payee, setPayee] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await addTransaction({
        payee,
        amount: parseFloat(amount),
        category,
        date,
        notes: notes || undefined
      })
      setOpen(false)
      onSuccess()
      // reset form
      setPayee(''); setAmount(''); setCategory('food'); setDate(new Date().toISOString().slice(0, 10)); setNotes('')
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating + button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevation-2 hover:shadow-elevation-3 transition grid place-items-center z-50"
        aria-label="Add transaction"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="bg-card rounded-xl shadow-elevation-2 p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="