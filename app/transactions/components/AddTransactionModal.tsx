'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { addTransaction, updateTransaction } from '@/app/transactions/action'

interface AddTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: any // For edit mode
  onSuccess?: () => void
}

export function AddTransactionModal({ open, onOpenChange, transaction, onSuccess }: AddTransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [formData, setFormData] = useState({
    payee: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    notes: ''
  })

  const isEditMode = !!transaction
  const modalTitle = isEditMode ? 'Edit Transaction' : 'Add Transaction'
  const submitButtonText = isEditMode ? 'Update Transaction' : 'Add Transaction'

  // 🔄 Populate form when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        payee: transaction.payee || '',
        amount: Math.abs(transaction.amount || 0).toString(),
        category: transaction.category || '',
        type: transaction.amount < 0 ? 'expense' : 'income',
        notes: transaction.notes || ''
      })
      setDate(new Date(transaction.date))
    } else {
      // Reset form for new transaction
      setFormData({
        payee: '',
        amount: '',
        category: '',
        type: 'expense',
        notes: ''
      })
      setDate(new Date())
    }
  }, [transaction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount)) throw new Error('Invalid amount')

      const transactionData = {
  payee: formData.payee,
  amount: formData.type === 'expense' ? -amount : amount,
  category: formData.category,
  date: date.toISOString(),
  notes: formData.notes || undefined
      }

      if (isEditMode) {
        await updateTransaction(transaction.id, transactionData)
      } else {
        await addTransaction(transactionData)
      }

      // Close modal and refresh
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert(`Failed to ${isEditMode ? 'update' : 'add'} transaction`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="payee">Payee</Label>
            <Input
              id="payee"
              value={formData.payee}
              onChange={(e) => setFormData({...formData, payee: e.target.value})}
              placeholder="Enter payee name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({...formData, type: value as 'income' | 'expense'})}
              disabled={isLoading}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value})}
              disabled={isLoading}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="transport">Transportation</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="bills">Bills & Utilities</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={setDate} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}