'use client'

import { useState, useTransition } from 'react'
import { createAccount, updateAccount } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, DollarSign, CreditCard, Building2, Plus, Edit, X, Wallet } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Account = {
  id: string
  name: string
  type: string
  balance: number
  institution: string | null
  currency: string
  is_active: boolean
}

type AccountFormProps = {
  account?: Account
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AccountForm({ account, open, onOpenChange, onSuccess }: AccountFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!account
  const modalTitle = isEditMode ? 'Edit Account' : 'Add New Account'
  const submitButtonText = isEditMode ? 'Update Account' : 'Create Account'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = account
        ? await updateAccount(account.id, formData)
        : await createAccount(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onOpenChange(false)
        onSuccess?.()
      }
    })
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    }
  }

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
                  {isEditMode ? 'Update your account information' : 'Add a new financial account to track your money'}
                </p>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Wallet className="h-4 w-4" />
                    Account Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={account?.name}
                    required
                    className="py-2 bg-background border-2 border-border focus:border-ring focus:ring-ring rounded-lg transition-all"
                    placeholder="e.g., Main Checking Account"
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Account Type *
                  </Label>
                  <select
                    id="type"
                    name="type"
                    defaultValue={account?.type || 'checking'}
                    required
                    disabled={isPending}
                    className="w-full px-3 py-2 bg-background border-2 border-border focus:border-ring rounded-lg transition-all text-sm"
                  >
                    <option value="checking">🏦 Checking</option>
                    <option value="savings">🐷 Savings</option>
                    <option value="credit_card">💳 Credit Card</option>
                    <option value="cash">💵 Cash</option>
                    <option value="investment">📈 Investment</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Current Balance
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="balance"
                      name="balance"
                      type="number"
                      step="0.01"
                      defaultValue={account?.balance || 0}
                      className="pl-8 pr-4 py-2 bg-background border-2 border-border focus:border-ring focus:ring-ring rounded-lg transition-all"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    Institution (Optional)
                  </Label>
                  <Input
                    id="institution"
                    name="institution"
                    defaultValue={account?.institution || ''}
                    className="py-2 bg-background border-2 border-border focus:border-ring focus:ring-ring rounded-lg transition-all"
                    placeholder="e.g., Chase Bank"
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Currency
                  </Label>
                  <Input
                    id="currency"
                    name="currency"
                    defaultValue={account?.currency || 'USD'}
                    className="py-2 bg-background border-2 border-border focus:border-ring focus:ring-ring rounded-lg transition-all"
                    disabled={isPending}
                  />
                </div>

                {account && (
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      defaultChecked={account.is_active}
                      value="true"
                      className="h-4 w-4 rounded border-gray-300"
                      disabled={isPending}
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">
                      Active Account
                    </label>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isPending}
                    className="px-4 py-2 border-2 border-border hover:bg-accent hover:text-accent-foreground rounded-lg transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        {isEditMode ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                        {submitButtonText}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
