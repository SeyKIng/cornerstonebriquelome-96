
-- Table pour stocker les transactions Semoa
CREATE TABLE IF NOT EXISTS semoa_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  order_id uuid REFERENCES orders(id),
  amount numeric NOT NULL,
  phone_number text NOT NULL,
  payment_method text NOT NULL,
  transaction_id text, -- ID retourné par Semoa
  status text DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
  semoa_response jsonb,
  order_summary jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour les logs d'API Semoa (debug et traçabilité)
CREATE TABLE IF NOT EXISTS semoa_api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES semoa_transactions(id),
  endpoint text NOT NULL,
  request_data jsonb,
  response_data jsonb,
  status_code integer,
  created_at timestamptz DEFAULT now()
);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_semoa_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_semoa_transactions_updated_at
  BEFORE UPDATE ON semoa_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_semoa_transactions_updated_at();

-- Politiques RLS pour semoa_transactions
ALTER TABLE semoa_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON semoa_transactions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create transactions" ON semoa_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage transactions" ON semoa_transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Politiques RLS pour semoa_api_logs
ALTER TABLE semoa_api_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage api logs" ON semoa_api_logs
  FOR ALL USING (auth.role() = 'service_role');
