-- ============================================
-- INSERIR/ATUALIZAR CONFIGURAÇÕES
-- ============================================
-- Cole este SQL no SQL Editor do Supabase e clique RUN

INSERT INTO configuracoes (id, nome_restaurante, endereco, telefone)
VALUES (1, 'Wilson Pizzas', 'Av. Antônio Pedro da Silva, 555, Centro, Ouricuri-PE', '5587999480699')
ON CONFLICT (id) DO UPDATE SET 
  endereco = 'Av. Antônio Pedro da Silva, 555, Centro, Ouricuri-PE',
  nome_restaurante = 'Wilson Pizzas',
  telefone = '5587999480699';

-- Verificar
SELECT * FROM configuracoes WHERE id = 1;
