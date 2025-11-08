import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: templates, error } = await supabase
    .from('budget_templates')
    .select('id, name, type, description, is_system, created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // include items if the table exists in your schema
  const { data: items } = await supabase
    .from('budget_template_items')
    .select('id, template_id, category_name, percent')

  const byTemplate: Record<string, any[]> = {}
  for (const it of items ?? []) {
    byTemplate[it.template_id] = byTemplate[it.template_id] || []
    byTemplate[it.template_id].push(it)
  }

  return NextResponse.json(
    (templates ?? []).map(t => ({ ...t, items: byTemplate[t.id] ?? [] }))
  )
}

export async function POST(req: Request) {
  const supabase = createClient()
  const body = await req.json()
  const { name, type, description, items } = body ?? {}
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const { data: tmpl, error } = await supabase
    .from('budget_templates')
    .insert([{ name, type: type ?? 'needs/wants/savings', description, is_system: false }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (Array.isArray(items) && items.length) {
    await supabase.from('budget_template_items').insert(
      items.map((it: any) => ({
        template_id: tmpl.id,
        category_name: it.category_name,
        percent: it.percent
      }))
    )
  }

  return NextResponse.json({ id: tmpl.id }, { status: 201 })
}
