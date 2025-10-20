'use client';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  console.error('Transactions page error:', error);
  return (
    <div className="p-4">
      <h2 className="text-red-600 font-semibold">Transactions failed to load</h2>
      <p className="text-sm text-gray-500">Digest: {error?.digest ?? 'n/a'}</p>
      <p className="mt-2 text-xs text-gray-400">
        We’ve logged the full error to the server logs. Try refreshing.
      </p>
    </div>
  );
}
