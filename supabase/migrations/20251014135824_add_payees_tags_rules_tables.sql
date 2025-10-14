/*
  # Add Payees, Transaction Tags, and Payee Rules Tables

  ## Overview
  Extends the finance schema with:
  - Payees table for standardized merchant/vendor management
  - Transaction tags for flexible categorization
  - Payee rules for automatic transaction categorization

  ## New Tables

  1. **payees**
     - `id` (uuid, primary key)
     - `user_id` (uuid, references profiles) - owner of the payee
     - `name` (text) - payee/merchant name
     - `default_category_id` (uuid, references categories) - suggested category
     - `notes` (text, optional) - additional info
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
     - UNIQUE constraint on (user_id, name)

  2. **transaction_tags**
     - `id` (uuid, primary key)
     - `transaction_id` (uuid, references transactions) - tagged transaction
     - `user_id` (uuid, references profiles) - for RLS
     - `tag` (text) - tag name/label
     - `created_at` (timestamptz)
     - UNIQUE constraint on (transaction_id, tag)

  3. **payee_rules**
     - `id` (uuid, primary key)
     - `user_id` (uuid, references profiles) - rule owner
     - `pattern` (text) - matching pattern (case-insensitive substring)
     - `payee_id` (uuid, references payees) - target payee
     - `category_id` (uuid, references categories) - auto-assign category
     - `priority` (integer) - rule precedence (higher = first)
     - `is_active` (boolean) - enable/disable rule
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

  ## Schema Changes

  - Add `payee_id` column to transactions table (nullable, FK to payees)
  - Add composite indexes on (user_id, date) for performance
  - Add index on transaction_tags (user_id, tag)

  ## Security

  - Enable RLS on all new tables
  - Strict policies: user_id = auth.uid() for all operations
  - Separate INSERT, SELECT, UPDATE, DELETE policies

  ## Indexes

  - (user_id, date) composite indexes on transactions
  - (user_id, name) on payees for lookups
  - (user_id, tag) on transaction_tags for filtering
  - (user_id, priority) on payee_rules for rule matching
*/

-- Create payees table
CREATE TABLE IF NOT EXISTS payees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  default_category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, name)
);

ALTER TABLE payees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payees"
  ON payees FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payees"
  ON payees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payees"
  ON payees FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payees"
  ON payees FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_payees_user_id ON payees(user_id);
CREATE INDEX IF NOT EXISTS idx_payees_user_id_name ON payees(user_id, name);
CREATE INDEX IF NOT EXISTS idx_payees_category ON payees(default_category_id);

-- Add payee_id to transactions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'payee_id'
  ) THEN
    ALTER TABLE transactions ADD COLUMN payee_id uuid REFERENCES payees(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_transactions_payee_id ON transactions(payee_id);
  END IF;
END $$;

-- Add composite index on transactions (user_id, date) for date-range queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id_date ON transactions(user_id, date DESC);

-- Create transaction_tags table
CREATE TABLE IF NOT EXISTS transaction_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(transaction_id, tag)
);

ALTER TABLE transaction_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transaction tags"
  ON transaction_tags FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transaction tags"
  ON transaction_tags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transaction tags"
  ON transaction_tags FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transaction tags"
  ON transaction_tags FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transaction_tags_transaction_id ON transaction_tags(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_tags_user_id ON transaction_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_tags_user_id_tag ON transaction_tags(user_id, tag);

-- Create payee_rules table
CREATE TABLE IF NOT EXISTS payee_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pattern text NOT NULL,
  payee_id uuid NOT NULL REFERENCES payees(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  priority integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE payee_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payee rules"
  ON payee_rules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payee rules"
  ON payee_rules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payee rules"
  ON payee_rules FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payee rules"
  ON payee_rules FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_payee_rules_user_id ON payee_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_payee_rules_payee_id ON payee_rules(payee_id);
CREATE INDEX IF NOT EXISTS idx_payee_rules_category_id ON payee_rules(category_id);
CREATE INDEX IF NOT EXISTS idx_payee_rules_user_id_priority ON payee_rules(user_id, priority DESC);
CREATE INDEX IF NOT EXISTS idx_payee_rules_is_active ON payee_rules(is_active) WHERE is_active = true;

-- Add updated_at triggers for new tables
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON payees
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON payee_rules
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Function to match payee and category by rules
CREATE OR REPLACE FUNCTION match_transaction_by_rules(
  p_user_id uuid,
  p_payee_text text
)
RETURNS TABLE (
  matched_payee_id uuid,
  matched_category_id uuid,
  rule_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pr.payee_id,
    pr.category_id,
    pr.id
  FROM payee_rules pr
  WHERE pr.user_id = p_user_id
    AND pr.is_active = true
    AND lower(p_payee_text) LIKE '%' || lower(pr.pattern) || '%'
  ORDER BY pr.priority DESC, pr.created_at ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
