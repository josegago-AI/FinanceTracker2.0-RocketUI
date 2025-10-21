'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import type { SavedQuery, UserView } from '@/lib/transactions/views.types'
import { normalizeForSave } from '@/lib/transactions/views.types'

export default function SavedViewsMenu({ initialQuery }: { initialQuery?: Record<string, any> }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const [views, setViews] = useState<UserView[]>([])
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')

  // Load views on mount
  useEffect(() => {
    let active = true
    fetch('/api/views')
      .then((r) => r.json())
      .then(({ views }) => {
        if (active) setViews(views ?? [])
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const currentQuery: SavedQuery = useMemo(
    () => normalizeForSave(Object.fromEntries(sp.entries())),
    [sp]
  )

  function applyQuery(q: SavedQuery) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(q)) {
      if (v === undefined || v === null || v === '') continue
      params.set(k, String(v))
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  async function saveCurrent() {
    const nm = name.trim() || 'New View'
    setSaving(true)
    try {
      const res = await fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nm, query: currentQuery }),
      })
      if (!res.ok) throw new Error('Failed to save view')
      const { view } = await res.json()
      setViews((v) => [view, ...v])
      setName('')
    } catch (e) {
      console.error(e)
      alert('Could not save view')
    } finally {
      setSaving(false)
    }
  }

  async function rename(id: string) {
    const nm = prompt('Rename view:')?.trim()
    if (!nm) return
    const res = await fetch(`/api/views/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nm }),
    })
    if (res.ok) {
      const { view } = await res.json()
      setViews((v) => v.map((x) => (x.id === id ? view : x)))
    } else {
      alert('Rename failed')
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this view?')) return
    const res = await fetch(`/api/views/${id}`, { method: 'DELETE' })
    if (res.ok) setViews((v) => v.filter((x) => x.id !== id))
    else alert('Delete failed')
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Save current view as…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-56"
      />
      <Button onClick={saveCurrent} disabled={saving} variant="default">
        Save View
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Saved Views</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {views.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No saved views yet
            </div>
          )}
          {views.map((v) => (
            <div key={v.id} className="px-2 py-1">
              <div className="flex items-center justify-between">
                <button
                  className="text-sm hover:underline"
                  onClick={() => applyQuery(v.query_json)}
                >
                  {v.name}
                </button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <button onClick={() => rename(v.id)}>Rename</button>
                  <button onClick={() => del(v.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {views.length > 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem onClick={() => applyQuery(currentQuery)}>
            Apply Current Filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
