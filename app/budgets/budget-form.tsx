'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Props {
  onClose: () => void
  onSave: (budgets: any[]) => void
}

export function BudgetForm({ onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: '',
    limit: '',
    month: '',
    year: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border border-border rounded-xl shadow-elevation-2">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">Add New Budget</DialogTitle>
        </DialogHeader>
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4 mt-4"
        >
          <div>
            <Label>Name</Label>
            <Input name="name" placeholder="Groceries" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Category</Label>
            <Input name="category" placeholder="Food" value={form.category} onChange={handleChange} />
          </div>
          <div>
            <Label>Limit</Label>
            <Input
              name="limit"
              type="number"
              placeholder="500"
              value={form.limit}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Month</Label>
              <Input name="month" placeholder="October" value={form.month} onChange={handleChange} />
            </div>
            <div>
              <Label>Year</Label>
              <Input name="year" placeholder="2025" value={form.year} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
