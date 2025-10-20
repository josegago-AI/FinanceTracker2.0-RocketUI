export type TxRow = {
  id: string;
  user_id: string;
  account_id?: string | null;
  category_id?: string | null;
  date: string;   // YYYY-MM-DD
  payee: string;
  amount: number; // keep original sign
  type?: string | null;
  note?: string | null;
  tags?: string[] | null;
  external_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type TxListParams = {
  userId: string;
  q?: string;
  categoryId?: string;
  tag?: string;
  start?: string; // YYYY-MM-DD
  end?: string;   // YYYY-MM-DD
  sort?: "date" | "amount" | "payee";
  dir?: "asc" | "desc";
  limit?: number; // 1..200
  cursor?: string | null; // id
};

export type Totals = { income: number; expense: number; net: number; };
