-- Verifique a estrutura atual da tabela cardapio
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'cardapio'
ORDER BY ordinal_position;
