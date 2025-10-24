import { Inbox } from 'lucide-react'

export default function GlobalEmpty({
  title = 'No data found',
  description = 'Try adding new items or adjusting filters.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[50vh] text-muted-foreground">
      <Inbox className="w-10 h-10 mb-3 opacity-60" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  )
}
