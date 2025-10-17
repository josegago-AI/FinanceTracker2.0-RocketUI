'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2, DollarSign, Tag, FileText, Clock, Plus, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { addTransaction, updateTransaction } from '@/app/transactions/action'
import { motion, AnimatePresence } from 'framer-motion'

interface AddTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: any
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
  const modalTitle = isEditMode ? 'Edit Transaction' : 'Add New Transaction'
  const submitButtonText = isEditMode ? 'Update Transaction' : 'Add Transaction'

  // 🎨 Rocket-style categories with icons
  const categories = [
    { value: 'food', label: 'Food & Dining', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
    { value: 'transport', label: 'Transportation', icon: '🚗', color: 'bg-blue-100 text-blue-800' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'bg-purple-100 text-purple-800' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'bg-pink-100 text-pink-800' },
    { value: 'bills', label: 'Bills & Utilities', icon: '💡', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥', color: 'bg-red-100 text-red-800' },
    { value: 'salary', label: 'Salary', icon: '💰', color: 'bg-green-100 text-green-800' },
    { value: 'freelance', label: 'Freelance', icon: '💼', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'other', label: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-800' }
  ]

  // 🎯 Pre-populate form when editing
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
      if (isNaN(amount) || amount <= 0) throw new Error('Please enter a valid amount')

      if (!formData.payee.trim()) throw new Error('Please enter a payee')
      if (!formData.category) throw new Error('Please select a category')

      const transactionData = {
        payee: formData.payee.trim(),
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

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert(error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'add'} transaction`)
    } finally {
      setIsLoading(false)
    }
  }

  // 🎨 Rocket-style animated entry
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
            >
              {/* 🎨 Rocket-style header with gradient */}
              <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  {isEditMode ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {modalTitle}
                </DialogTitle>
                <p className="text-blue-100 text-sm mt-1">
                  {isEditMode ? 'Update your transaction details' : 'Track your financial activity'}
                </p>
              </DialogHeader>

              {/* 🎯 Rocket-style form with better spacing */}
              <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                {/* Amount & Type Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Amount *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="pl-8 pr-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                        placeholder="0.00"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type *
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as 'income' | 'expense'})} disabled={isLoading}>
                      <SelectTrigger className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense" className="flex items-center gap-2">
                          <span className="text-red-500">↗</span> Expense
                        </SelectItem>
                        <SelectItem value="income" className="flex items-center gap-2">
                          <span className="text-green-500">↘</span> Income
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Payee */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Tag className="h-4 w-4 text-gray-500" />
                    Payee / Description *
                  </Label>
                  <Input
                    value={formData.payee}
                    onChange={(e) => setFormData({...formData, payee: e.target.value})}
                    className="py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                    placeholder="Where did you spend / receive money?"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    📂 Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} disabled={isLoading}>
                    <SelectTrigger className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="flex items-center gap-2">
                          <span className={cn("px-2 py-1 rounded-full text-xs", cat.color)}>
                            {cat.icon}
                          </span>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "w-full justify-start text-left font-normal py-2 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-all",
                          !date && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-2">
                        <Calendar 
                          mode="single" 
                          selected={date} 
                          onSelect={(newDate) => newDate && setDate(newDate)} 
                          initialFocus 
                          required={false}
                          className="rounded-md"
                          classNames={{
                            months: "space-y-2",
                            month: "space-y-2",
                            caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-200 rounded-md",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "h-9 w-9 text-center text-sm p-0 relative",
                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-100 rounded-md transition-colors",
                            day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600 focus:text-white",
                            day_today: "bg-blue-100 text-blue-800",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_hidden: "invisible",
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Notes (Optional)
                  </Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                    placeholder="Any additional details..."
                    disabled={isLoading}
                  />
                </div>
              </form>

              {/* 🎯 Rocket-style footer with better buttons */}
              <div className="flex justify-end space-x-3 p-6 pt-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="px-4 py-2 border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      {isEditMode ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                      {submitButtonText}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}