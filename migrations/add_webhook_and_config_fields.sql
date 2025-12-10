-- Add new configuration fields to configuracoes table
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS webhook_url TEXT;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS supabase_url TEXT;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS supabase_key TEXT;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS whatsapp_notification BOOLEAN DEFAULT true;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS horarios TEXT;

-- Update the updated_at timestamp
UPDATE configuracoes SET updated_at = now() WHERE id = 1;
