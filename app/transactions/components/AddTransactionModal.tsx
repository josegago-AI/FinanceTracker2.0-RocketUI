'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2, DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Plus, Edit, X } from 'lucide-react'
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

// 🎯 Rocket-style icon mapping (from your Rocket repo pattern)
const getTransactionIcon = (type: 'income' | 'expense') => {
  return type === 'income' ? 
    { icon: TrendingUp, color: 'text-success' } : 
    { icon: TrendingDown, color: 'text-destructive' }
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

  // 🎨 Rocket-style categories (matching your Rocket repo aesthetic)
  const categories = [
    { value: 'food', label: 'Food & Dining', icon: '🍽️', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
    { value: 'transport', label: 'Transportation', icon: '🚗', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' },
    { value: 'bills', label: 'Bills & Utilities', icon: '💡', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
    { value: 'salary', label: 'Salary', icon: '💰', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'freelance', label: 'Freelance', icon: '💼', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
    { value: 'other', label: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' }
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

  // 🎨 Rocket-style animated entry (matching your Rocket repo patterns)
  const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.2, 
      ease: [0.25, 0.46, 0.45, 0.94] // ✅ Proper easing array
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { 
      duration: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] // ✅ Proper easing array
    } 
  }
}

  const { icon: TypeIcon, color: typeColor } = getTransactionIcon(formData.type)

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border elevation-3">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-card text-card-foreground"
            >
              {/* 🎨 Rocket-style header - matching your Rocket repo aesthetic */}
              <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-b border-border">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-white/20 backdrop-blur-sm`}>
                      {isEditMode ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </div>
                    {modalTitle}
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="h-8 w-8 p-0 hover:bg-white/20 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-primary-foreground/80 text-sm mt-1">
                  {isEditMode ? 'Update your transaction details' : 'Track your financial activity with precision'}
                </p>
              </DialogHeader>

              {/* 🎯 Rocket-style form - matching your Rocket repo patterns */}
              <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                {/* Amount & Type Row - Rocket-style layout */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Amount *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="pl-8 pr-4 py-2 bg-background border-2 border-border focus:border-ring focus:ring-ring rounded-lg transition-all"
                        placeholder="0.00"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Type *
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as 'income' | 'expense'})} disabled={isLoading}>
                      <SelectTrigger className="w-full bg-background border-2 border-border focus:border-ring rounded-lg">
                        <div className="flex items-center gap-2">
                          <TypeIcon className={`h-4 w-4 ${typeColor}`} />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense" className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-destructive" />
                          Expense
                        </SelectItem>
                        <SelectItem value="income" className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          Income
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Payee - Rocket-style input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Wallet className="h-4 w-4" />
                    Payee / Description *
                  </Label>
                  <Input
                    value={formData.payee}
                    onChange={(e) => setFormData({...formData, payee: e.target.value})}
                    className="py-2 bg-background border-2 border-border focus:border-ring focus:ring-ring rounded-lg transition-all"
                    placeholder="Where did you spend / receive money?"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Category - Rocket-style categories */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} disabled={isLoading}>
                    <SelectTrigger className="w-full bg-background border-2 border-border focus:border-ring rounded-lg">
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

                {/* Date - Rocket-style date picker */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "w-full justify-start text-left font-normal py-2 bg-background border-2 border-border hover:border-ring rounded-lg transition-all",
                          !date && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="bg-popover border border-border rounded-lg p-2 elevation-2">
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
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-border rounded-md",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "h-9 w-9 text-center text-sm p-0 relative",
                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md transition-colors",
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_hidden: "invisible",
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Notes - Rocket-style */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Notes (Optional)
                  </Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="py-2 bg-background border-2 border-border focus:border-ring focus:ring-ring rounded-lg transition-all"
                    placeholder="Additional details..."
                    disabled={isLoading}
                  />
                </div>
              </form>

              {/* 🎯 Rocket-style footer - matching your Rocket repo patterns */}
              <div className="flex justify-end space-x-3 p-6 pt-4 bg-muted/30 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="px-4 py-2 border-2 border-border hover:bg-accent hover:text-accent-foreground rounded-lg transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all shadow-md hover:shadow-lg"
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