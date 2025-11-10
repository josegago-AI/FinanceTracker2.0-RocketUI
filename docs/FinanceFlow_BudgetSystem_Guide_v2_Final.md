# FinanceFlow – Budget System Master Guide (v2, Final)

---

## 🧠 Core Concept
FinanceFlow’s **Budget Dashboard** is a KPI‑driven system that unifies budgeting, analytics, and real‑time tracking. Each month’s plan is flexible—users can edit categories mid‑cycle, rebalance allocations, and see instant updates without breaking historical data.

---

## 🎯 UX Philosophy
- **Predictable:** Clear hierarchy—KPI → Overview → Category Grid.  
- **Flexible:** Budgets evolve mid‑month with controlled redistribution.  
- **Safe:** Row‑Level Security ensures user isolation; monthly versioning preserves history.

---

## ⚙️ Architecture Overview

**Frontend:** Next.js 14 (App Router) + Tailwind + Rocket UI  
**Backend:** Supabase (PostgreSQL) with RLS + SQL migrations  
**State:** Server Actions + SWR hydration  
**Design Tokens:** HSL variables (`--background`, `--card`, etc.)  

Main modules:
```
/app/budgets/
 ├─ page.tsx
 ├─ layout.tsx
 ├─ actions.ts
 └─ components/
     ├─ KPIHeader.tsx
     ├─ BudgetOverviewCard.tsx
     ├─ FilterBar.tsx
     ├─ BudgetGrid.tsx
     ├─ EditBudgetModal.tsx
     └─ CategorySelector.tsx
```

---

## 📊 KPI Dashboard

Each KPI is clickable and filters the grid.  

| KPI | Formula | Icon | Purpose |
|-----|----------|------|----------|
| **Total Allocated** | `SUM(budgets.amount)` | 💰 | Planned spend |
| **Total Spent** | `SUM(transactions.amount)` | 💳 | Actual spend |
| **Remaining** | `allocated − spent` | 💼 | Left to spend |
| **Other Spend** | `tx NOT IN budgets` | 🛍️ | Unbudgeted |
| **Overall Progress** | `(spent/allocated)*100` | 📊 | Efficiency |

### KPI Colors
```ts
export const STATUS = { safe:'text-green-500', warn:'text-yellow-500', danger:'text-red-500' }
```

---

## ⚡ Example Server Action

```ts
import { createClient } from '@/lib/supabase/server'

export async function getBudgets(userId:string) {
  const sb = createClient()
  const { data, error } = await sb
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending:false })
  if (error) throw error
  return data
}
```

---

## 🧱 Supabase Schema (Simplified)

| Table | Key columns |
|--------|--------------|
| profiles | id, email |
| categories | id, user_id, name, type, color |
| budget_templates | id, user_id, name, type |
| budget_template_items | id, template_id, category_name, percent |
| budgets | id, user_id, category_id, amount, month, year |
| transactions | id, user_id, category_id, amount, date, description |

RLS example:
```sql
CREATE POLICY "own budgets only"
ON public.budgets
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

---

## 🧭 Workflow Summary

### 1 – Create Budget
User selects categories and allocations (manual or template).

### 2 – Mid‑Month Edit
Tap “Edit Budget Plan” → Add/Remove categories.  
Choose:
- **Auto‑Rebalance** (system divides evenly)  
- **Manual Adjust** (user sets % manually)

### 3 – Confirm
App stores revision for same month, preserving past transactions.

---

## 🎨 Design Language
- Rounded (`rounded‑xl`), soft gradients.  
- Smooth hover shadows (`shadow‑[0_4px_12px_rgba(0,0,0,0.05)]`).  
- Animated transitions (`animate‑slide‑up`, `animate‑fade‑in`).  
- Color cues: green = safe, yellow = approaching, red = exceeded.  
- Dark mode: HSL palette parity.

---

## 📈 Analytics Page
Expanded metrics for trends and comparisons:
- Line charts by category (Recharts).  
- “This Month vs Last Month” comparisons.  
- CSV export.  
- Drill‑down modal for category history.

---

## 💬 User Flow (POV)

1. Lands on **Budgets** → KPI Row + Overview.  
2. Clicks KPI → Grid filters dynamically.  
3. Adjusts FilterBar (status, period, sort).  
4. Clicks a card → Detail modal shows trend & transactions.  
5. Presses “Edit Budget Plan” → CategorySelector.  
6. Adds “Rent” → prompts Auto/Manual rebalance.  
7. Confirms → UI re‑renders instantly.

---

## 🪟 Modal Behavior
**EditBudgetModal** – tabs: *Adjust Allocations*, *Add/Remove Categories*  
**CategorySelector** – checkbox grid + live % sum  
**RebalancePrompt** – confirms rebalance mode  
**Validation:** sum = 100% max  
Animations: fade/slide‑up.

---

## 🧱 UI Mockup (Text)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                NAVBAR (RocketHeader)                       │
└────────────────────────────────────────────────────────────────────────────┘

Budgets
Create and manage your spending budgets to stay on track with your financial goals.
─────────────────────────────────────────────────────────────────────────────
                             [ Templates ▼ ]  [ Grid ▢ ]  [ + Create Budget ]
─────────────────────────────────────────────────────────────────────────────

─────────────────────────────── KPI ROW ─────────────────────────────────────
 Each KPI = Clickable, switches view + highlights when active.

┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Total Allocated │ Total Spent │ Remaining │ Other Spend │ Overall Prog.│
│ $2,300 │ $1,850 │ $450 │ $210 │ 80.4% │
│ 💰 │ 💳 │ 💼 │ 🛍️ │ 📊 (sparkline) │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

────────────────────────── Budget Status Overview ────────────────────────────
┌────────────────────────────────────────────────────────────────────────────┐
│ ✅ On Track: 4  ⚠️ Approaching: 2  🔴 Exceeded: 1                         │
│ [ ▓▓▓▓▓▓▓░░░ 74% overall compliance this month ]                           │
└────────────────────────────────────────────────────────────────────────────┘

────────────────────────────── Filter Bar ───────────────────────────────────
Status: [ All | On Track | Approaching | Exceeded ]
Period: [ Current Month ▼ ]
Sort: [ Category Name ▼ ]

────────────────────────────── Main Grid ────────────────────────────────────
Example → “Total Spent” KPI active
------------------------------------------------------------
┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│ Dining Out │ Groceries │ Transportation │
│ Allocated $300 │ Allocated $600 │ Allocated $200 │
│ Spent $250 │ Spent $520 │ Spent $180 │
│ Remaining $50 │ Remaining $80 │ Remaining $20 │
│ ▓▓▓▓▓▓▓░░ 83% │ ▓▓▓▓▓▓▓▓░░ 87% │ ▓▓▓▓▓▓▓░░░ 90% │
│ Trend: ↓5% │ Trend: ↑10% │ Trend: ↔ │
└────────────────────┘ └────────────────────┘ └────────────────────┘
```

---

## 🔮 Future Hooks
- AI‑driven budget suggestions.  
- Historical projection charts.  
- Shared budgets for couples/families.

---

✅ Includes: schema + RLS, KPI logic, UI mockup, modal flow, design language, analytics plan.
