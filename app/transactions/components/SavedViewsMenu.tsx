'use client'
body: JSON.stringify({ name: nm })
})
if (res.ok) {
const { view } = await res.json()
setViews(v => v.map(x => x.id === id ? view : x))
}
}

async function del(id: string) {
if (!confirm('Delete this view?')) return
const res = await fetch(`/api/views/${id}`, { method: 'DELETE' })
if (res.ok) setViews(v => v.filter(x => x.id !== id))
}

return (
<div className="flex items-center gap-2">
<Input
placeholder="Save current view as…"
value={name}
onChange={(e) => setName(e.target.value)}
className="w-56"
/>
<Button onClick={saveCurrent} disabled={saving} variant="default">Save View</Button>

<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button variant="outline">Saved Views</Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="start" className="w-56">
{views.length === 0 && (
<div className="px-3 py-2 text-sm text-muted-foreground">No saved views yet</div>
)}
{views.map(v => (
<div key={v.id} className="px-2 py-1">
<div className="flex items-center justify-between">
<button className="text-sm hover:underline" onClick={() => applyQuery(v.query_json)}>
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
<DropdownMenuItem onClick={() => applyQuery(currentQuery)}>Apply Current Filters</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</div>
)
}