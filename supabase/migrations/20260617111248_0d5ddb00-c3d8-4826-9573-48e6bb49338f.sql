CREATE TABLE IF NOT EXISTS public.paystack_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  paystack_reference TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'delivered')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.paystack_orders TO authenticated;
GRANT ALL ON public.paystack_orders TO service_role;

ALTER TABLE public.paystack_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own paystack orders"
  ON public.paystack_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own paystack orders"
  ON public.paystack_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_paystack_orders_user_id ON public.paystack_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_paystack_orders_reference ON public.paystack_orders(paystack_reference);