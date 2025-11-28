-- ============================================
-- PRODUTOS DO IFOOD QUE FALTAM NO CARDÁPIO
-- ============================================
-- Execute este SQL no Supabase para adicionar os produtos encontrados no iFood

-- ============================================
-- 1. MASSAS TRADICIONAIS (NOVOS)
-- ============================================
INSERT INTO public.cardapio (nome_item, categoria, descricao, imagem_url, precos, disponivel) VALUES
('Espaguete', 'Massas', 'Serve 1 pessoa. Espaguete com molho da casa.', '', '{"P": 26}', true),
('Parafuso', 'Massas', 'Serve 1 pessoa. Parafuso com molho da casa.', '', '{"P": 26}', true),
('Penne', 'Massas', 'Serve 1 pessoa. Penne com molho da casa.', '', '{"P": 26}', true),
('Talharim', 'Massas', 'Serve 1 pessoa. Talharim com molho da casa.', '', '{"P": 26}', true);

-- ============================================
-- 2. PASTÉIS DE FORNO (NOVOS)
-- ============================================
INSERT INTO public.cardapio (nome_item, categoria, descricao, imagem_url, precos, disponivel) VALUES
('Pastel de Forno 4 Queijos', 'Pastéis de Forno', 'Pastel de forno orgânico com 4 queijos.', '', '{"P": 14}', true),
('Pastel de Forno Bauru', 'Pastéis de Forno', 'Pastel de forno orgânico com presunto, mussarela e tomate.', '', '{"P": 14}', true),
('Pastel de Forno Carne de Sol com Cream Cheese', 'Pastéis de Forno', 'Pastel de forno orgânico com carne de sol e cream cheese.', '', '{"P": 17}', true),
('Pastel de Forno Charque', 'Pastéis de Forno', 'Pastel de forno orgânico com carne de charque.', '', '{"P": 14}', true),
('Pastel de Forno Frango com Catupiry', 'Pastéis de Forno', 'Pastel de forno orgânico com frango desfiado e catupiry.', '', '{"P": 12}', true),
('Pastel de Forno Frango com Cream Cheese', 'Pastéis de Forno', 'Pastel de forno orgânico com frango e cream cheese.', '', '{"P": 17}', true),
('Pastel de Forno Moda do Cliente', 'Pastéis de Forno', 'Pastel de forno orgânico personalizado.', '', '{"P": 18}', true),
('Pastel de Forno Mussarela com Tomate', 'Pastéis de Forno', 'Pastel de forno orgânico com mussarela e tomate.', '', '{"P": 13}', true),
('Pastel de Forno Portuguesa', 'Pastéis de Forno', 'Pastel de forno orgânico com presunto, ovos e cebola.', '', '{"P": 14}', true),
('Pastel de Forno À Moda da Casa', 'Pastéis de Forno', 'Pastel de forno orgânico com receita especial da casa.', '', '{"P": 15}', true),
('Pastel de Forno Calabresa com Queijo', 'Pastéis de Forno', 'Pastel de forno orgânico com calabresa e queijo.', '', '{"P": 14}', true);

-- ============================================
-- 3. LASANHAS (NOVOS)
-- ============================================
INSERT INTO public.cardapio (nome_item, categoria, descricao, imagem_url, precos, disponivel) VALUES
('Lasanha Bolonhesa', 'Lasanhas', 'Massa caseira. Serve uma pessoa. Lasanha com molho bolonhesa artesanal.', '', '{"P": 35}', true),
('Lasanha Presunto e Queijo', 'Lasanhas', 'Massa caseira. Serve uma pessoa. Lasanha com presunto e queijo.', '', '{"P": 35}', true),
('Lasanha 4 Queijos', 'Lasanhas', 'Massa caseira. Serve uma pessoa. Lasanha com 4 tipos de queijo.', '', '{"P": 35}', true),
('Lasanha de Frango com Molho Branco', 'Lasanhas', 'Massa caseira. Serve uma pessoa. Lasanha de frango com molho branco cremoso.', '', '{"P": 35}', true),
('Lasanha de Carne de Sol', 'Lasanhas', 'Massa caseira. Serve uma pessoa. Lasanha com carne de sol desfiada.', '', '{"P": 35}', true);

-- ============================================
-- 4. PETISCOS (ADICIONAIS - Temos pizzas, mas não esses pratos)
-- ============================================
INSERT INTO public.cardapio (nome_item, categoria, descricao, imagem_url, precos, disponivel) VALUES
('Filé à Parmegiana', 'Petiscos', 'Filé coberto com molho tomate, mussarela e parmesão. #executivo #refeicao #jantar #parmegiana', '', '{"P": 48}', true),
('Filé 4 Queijos', 'Petiscos', 'Filé coberto com 4 tipos de queijo. Serve 2 pessoas.', '', '{"P": 70}', true),
('Arroz', 'Petiscos', 'Arroz branco cozido no vapor. Serve 1 pessoa.', '', '{"P": 7}', true),
('Frango à Passarinho', 'Petiscos', 'Frango crocante. Acompanha fritas e salada. Serve 1 pessoa.', '', '{"P": 35}', true),
('Batata Frita com Bacon e Cheddar', 'Petiscos', 'Batata frita sequinha com bacon crocante e cobertura de cheddar.', '', '{"P": 30}', true),
('Filé com Fritas', 'Petiscos', 'Filé grelhado acompanhado com batata frita. Serve 1 pessoa.', '', '{"P": 40}', true),
('Carne de Sol com Fritas', 'Petiscos', 'Carne de sol desfiada com batata frita. Serve 1 pessoa.', '', '{"P": 38}', true),
('Batata Frita', 'Petiscos', 'Batata frita sequinha com sal. Serve 1 pessoa.', '', '{"P": 18}', true),
('Batata Frita com Calabresa', 'Petiscos', 'Batata frita com calabresa crocante. Serve 1 pessoa.', '', '{"P": 24}', true),
('Camarão Alho e Óleo 400g', 'Petiscos', 'Camarão fresco ao alho e óleo. Serve 2 pessoas.', '', '{"P": 47}', true);

-- ============================================
-- 5. CALZONES (NOVOS)
-- ============================================
INSERT INTO public.cardapio (nome_item, categoria, descricao, imagem_url, precos, disponivel) VALUES
('Mini Calzone de Camarão', 'Calzones', 'Mini calzone crocante recheado com camarão.', '', '{"P": 17}', true),
('Mini Calzone de Carne de Sol', 'Calzones', 'Mini calzone crocante recheado com carne de sol desfiada.', '', '{"P": 15}', true),
('Mini Calzone de Bacon com Queijo', 'Calzones', 'Mini calzone crocante recheado com bacon e queijo derretido.', '', '{"P": 14}', true);

-- ============================================
-- 6. BEBIDAS (ADICIONAIS)
-- ============================================
INSERT INTO public.cardapio (nome_item, categoria, descricao, imagem_url, precos, disponivel) VALUES
('Refrigerante 2L', 'Bebidas', 'Escolha o seu sabor favorito em garrafa de 2 litros.', '', '{"P": 12}', true),
('Refrigerante 350ml', 'Bebidas', 'Refrigerante gelado em lata de 350ml.', '', '{"P": 5}', true),
('Suco Natural 500ml', 'Bebidas', 'Suco natural fresco preparado na hora. Sabores variados.', '', '{"P": 10}', true),
('Água 500ml', 'Bebidas', 'Água mineral gelada.', '', '{"P": 3}', true);

-- ============================================
-- RESUMO DE ADIÇÕES
-- ============================================
-- Total de novos produtos: 44
-- Distribuição:
-- - Massas Tradicionais: 4
-- - Pastéis de Forno: 11
-- - Lasanhas: 5
-- - Petiscos: 10
-- - Calzones: 3
-- - Bebidas: 4
-- Total: 37 novos produtos de categoria diferentes

-- ============================================
-- NOTA IMPORTANTE
-- ============================================
-- Estes produtos foram encontrados no iFood e não estão em nosso cardápio.
-- Verificar preços com o proprietário da pizzaria antes de inserir no Supabase.
-- Alguns preços foram extraídos do iFood, mas podem estar desatualizados.
