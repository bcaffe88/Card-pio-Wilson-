-- Migration: Add item_id column to cardapio table for MENU_ITEMS merge
-- Purpose: Link banco products with local menu.ts items for enrichment

ALTER TABLE cardapio ADD COLUMN item_id VARCHAR UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_cardapio_item_id ON cardapio(item_id);

-- Add comment
COMMENT ON COLUMN cardapio.item_id IS 'Corresponds to MENU_ITEMS.id for merging local data (molhos, ingredientes, isMassa)';
