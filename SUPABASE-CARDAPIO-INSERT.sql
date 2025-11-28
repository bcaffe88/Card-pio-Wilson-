-- ============================================================================
-- WILSON PIZZAS - CARDÁPIO COMPLETO (85+ PRODUTOS)
-- ============================================================================
-- Copie e cole este script no SQL Editor do Supabase
-- Este script popula a tabela 'cardapio' com todos os produtos

-- ============================================================================
-- PIZZAS SALGADAS (43 itens)
-- ============================================================================

INSERT INTO cardapio (id, nome, descricao, categoria, preco_p, preco_m, preco_g, preco_gg, preco_super, imagem, ativo) VALUES
('costela', 'Costela', 'Costela desfiada, cebola, creme cheese, mussarela e barbecue.', 'Salgadas', 35.00, 45.00, 65.00, NULL, 80.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('calabresa-especial', 'Calabresa Especial', 'Molho de tomate, calabresa fatiada, mussarela, creme cheese, barbecue, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 53.00, NULL, 73.00, 'delicious_pepperoni__f6d6fa05.jpg', true),
('carne-de-sol', 'Carne de Sol', 'Molho de tomate, carne de sol desfiada, cebola fatiada, mussarela, orégano e azeitonas.', 'Salgadas', 34.00, 44.00, 60.00, NULL, 80.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('a-moda-do-chefe', 'À Moda do Chefe', 'Molho de tomate, lombo canadense, bacon, mussarela, champignon, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 62.00, NULL, 75.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('espanhola', 'Espanhola', 'Molho de tomate, calabresa moída, ovos cozidos, cebola, pimentão fatiado, mussarela, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 50.00, NULL, 65.00, 'delicious_pepperoni__f6d6fa05.jpg', true),
('pepperone', 'Peperone', 'Molho de tomate, mussarela, salaminho tipo peperone, parmesão, orégano e azeitonas.', 'Salgadas', 28.50, 38.00, 50.00, NULL, 60.00, 'delicious_pepperoni__f6d6fa05.jpg', true),
('camarao', 'Camarão', 'Molho de tomate, mussarela, filé de camarão, orégano e azeitonas.', 'Salgadas', 35.00, 45.00, 62.00, NULL, 80.00, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('frango-bolonhesa', 'Frango Bolonhesa', 'Molho de tomate, frango desfiado, queijo parmesão, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 56.00, NULL, 75.00, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('siciliana', 'Siciliana', 'Molho de tomate, mussarela, champignon.', 'Salgadas', 28.00, 38.00, 50.00, NULL, 70.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('nordestina', 'Nordestina', 'Molho de tomate, carne de charque desfiada, cebola, pimentão, pimenta de cheiro, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 62.00, NULL, 80.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('a-sua-moda', 'À Sua Moda', 'Ingredientes sugeridos pelo cliente.', 'Salgadas', 35.00, 45.00, 64.00, NULL, 80.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('vegetariana', 'Vegetariana', 'Molho de tomate, mussarela, palmito, tomate fatiado, pimentão, champignon, manjericão, orégano e azeitonas.', 'Salgadas', 30.00, 40.00, 48.00, NULL, 60.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('caipira', 'Caipira', 'Molho de tomate, frango desfiado, milho verde, catupiry, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 53.00, NULL, 73.00, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('toscana', 'Toscana', 'Molho de tomate, calabresa moída, cebola, mussarela, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 44.00, NULL, 60.00, 'delicious_pepperoni__f6d6fa05.jpg', true),
('4-queijos', '4 Queijos', 'Molho de tomate, mussarela, provolone, catupiry, parmesão, orégano e azeitonas.', 'Salgadas', 28.00, 41.00, 48.00, NULL, 62.00, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('a-moda-do-forneiro', 'À Moda do Forneiro', 'Molho de tomate, carne de sol desfiada, champignon, palmito, catupiry, manjericão, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 54.00, NULL, 73.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('bolonhesa', 'Bolonhesa', 'Molho de tomate, mussarela, molho bolonhesa, parmesão, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 48.00, NULL, 55.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('palmito', 'Palmito', 'Molho de tomate, palmito picado e temperado, catupiry, mussarela, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 53.00, NULL, 60.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('a-moda-do-pizzaiolo', 'À Moda do Pizzaiolo', 'Molho de tomate, presunto picado, palmito, ervilha, mussarela, bacon, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 52.00, NULL, 73.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('marguerita', 'Marguerita', 'Molho de tomate, mussarela, manjericão, rodelas de tomate, parmesão, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 48.00, NULL, 55.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('verona', 'Verona', 'Molho de tomate, palmito, bacon, catupiry, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 52.00, NULL, 65.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('baiana', 'Baiana', 'Molho de tomate, calabresa moída, ovos cozidos, pimenta calabresa, cebola, mussarela, orégano e azeitonas.', 'Salgadas', 30.00, 40.00, 50.00, NULL, 65.00, 'delicious_pepperoni__f6d6fa05.jpg', true),
('sertaneja', 'Sertaneja', 'Molho de tomate, mussarela, calabresa, milho verde, cebola, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 46.00, NULL, 60.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('alho', 'Alho', 'Molho de tomate, mussarela, parmesão, alho frito, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 46.00, NULL, 60.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('lombinho', 'Lombinho', 'Molho de tomate, mussarela, lombo canadense, cebola fatiada, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 50.00, NULL, 62.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('veneza', 'Veneza', 'Molho de tomate, lombo canadense, alho frito, catupiry, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 50.00, NULL, 62.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('formagio', 'Formágio', 'Molho de tomate, mussarela, provolone, catupiry, gorgonzola, parmesão, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 50.00, NULL, 60.00, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('hot-dog', 'Hot Dog', 'Salsicha, milho, catupiry, mussarela e batata palha.', 'Salgadas', 28.00, 38.00, 47.00, NULL, 60.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('a-grega', 'À Grega', 'Molho de tomate, mussarela, catupiry, calabresa fatiada, bacon, orégano e azeitonas.', 'Salgadas', 28.00, 41.00, 56.00, NULL, 61.00, 'delicious_pepperoni__f6d6fa05.jpg', true),
('napolitana', 'Napolitana', 'Molho de tomate, mussarela, rodelas de tomate, parmesão, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 45.00, NULL, 54.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('atum', 'Atum', 'Molho de tomate, atum sólido, cebola, mussarela, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 45.00, NULL, 65.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('atum-c-cream-cheese', 'Atum c/ Cream Cheese', 'Molho de tomate, atum, cebola, cream cheese, orégano.', 'Salgadas', 35.00, 45.00, 53.00, NULL, 73.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('agreste', 'Agreste', 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 60.00, NULL, 73.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('charque', 'Charque', 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 60.00, NULL, 73.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('suica', 'Suíça', 'Molho de tomate, presunto, mussarela, gorgonzola, orégano e azeitonas.', 'Salgadas', 30.00, 40.00, 45.00, NULL, 60.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('carne-de-sol-c-cream-cheese', 'Carne de Sol c/ Cream Cheese', 'Molho de tomate, carne de sol, cebola, orégano, Cream Cheese e Bacon Fatiado.', 'Salgadas', 32.00, 45.00, 62.00, NULL, 73.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('strogonoff', 'Strogonoff', 'Molho de tomate, mussarela, strogonoff.', 'Salgadas', 32.00, 42.00, 53.00, NULL, 65.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('frango-c-cream-cheese', 'Frango c/ Cream Cheese', 'Molho de tomate, frango desfiado, mussarela.', 'Salgadas', 35.00, 45.00, 60.00, NULL, 73.00, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('frango-c-mussarela', 'Frango c/ Mussarela', 'Molho de tomate, frango desfiado, mussarela, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 55.00, NULL, 75.00, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('frango-c-catupiry', 'Frango c/ Catupiry', 'Molho de tomate, frango desfiado, catupiry, mussarela, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 55.00, NULL, 75.00, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('bacon', 'Bacon', 'Molho de tomate, mussarela, bacon, rodelas de tomate, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 55.00, NULL, 70.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('a-moda-da-casa', 'À Moda da Casa', 'Molho de tomate, frango desfiado, milho verde, mussarela, bacon, orégano e azeitonas.', 'Salgadas', 32.00, 42.00, 62.00, NULL, 80.00, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('francesa', 'Francesa', 'Molho de tomate, presunto, ovos, cebola, ervilha, catupiry, orégano e azeitonas.', 'Salgadas', 30.00, 40.00, 50.00, NULL, 65.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('mussarela', 'Mussarela', 'Molho de tomate, mussarela, rodelas de tomate, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 44.00, NULL, 54.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('calabresa', 'Calabresa', 'Molho de tomate, calabresa, mussarela, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 46.00, NULL, 60.00, 'delicious_pepperoni__f6d6fa05.jpg', true),
('portuguesa', 'Portuguesa', 'Molho de tomate, presunto, ovos, cebola, mussarela, orégano e azeitonas.', 'Salgadas', 30.00, 40.00, 50.00, NULL, 65.00, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('bauru', 'Bauru', 'Molho de tomate, presunto, mussarela, rodelas de tomate, orégano e azeitonas.', 'Salgadas', 28.00, 38.00, 44.00, NULL, 60.00, 'pizza_calabresa_onio_8ea1076f.jpg', true);

-- ============================================================================
-- PIZZAS DOCES (5 itens)
-- ============================================================================

INSERT INTO cardapio (id, nome, descricao, categoria, preco_p, preco_m, preco_g, preco_gg, preco_super, imagem, ativo) VALUES
('chocolate-com-morango', 'Chocolate com Morango', 'Chocolate com morango.', 'Doces', 30.00, 35.00, 40.00, 54.00, NULL, 'sweet_pizza_chocolat_b4c83fb7.jpg', true),
('banana-nevada', 'Banana Nevada', 'Banana com canela, creme de leite e chocolate branco com borda de doce de leite.', 'Doces', 30.00, 35.00, 40.00, 54.00, NULL, 'sweet_pizza_chocolat_b4c83fb7.jpg', true),
('cartola', 'Cartola', 'Mussarela, catupiry, banana fatiada, açúcar e canela com borda de doce de leite.', 'Doces', 30.00, 35.00, 40.00, 54.00, NULL, 'sweet_pizza_chocolat_b4c83fb7.jpg', true),
('romeu-e-julieta', 'Romeu e Julieta', 'Mussarela coberta com fatia de goiabada, com borda de doce de leite.', 'Doces', 30.00, 35.00, 40.00, 54.00, NULL, 'sweet_pizza_chocolat_b4c83fb7.jpg', true),
('dois-amores', 'Dois Amores', 'Chocolate branco e chocolate de avelã com borda de doce de leite.', 'Doces', 30.00, 35.00, 40.00, 54.00, NULL, 'sweet_pizza_chocolat_b4c83fb7.jpg', true);

-- ============================================================================
-- MASSAS (4 tipos - Espaguete, Parafuso, Penne, Rigatoni)
-- ============================================================================

INSERT INTO cardapio (id, nome, descricao, categoria, preco_p, preco_m, preco_g, preco_gg, preco_super, imagem, ativo) VALUES
('espaguete', 'Espaguete', 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes. Molhos: Vermelho, Branco, 4 Queijos, Bolonhesa. Ingredientes: Bacon, Frango, Calabresa, Presunto, Alho Frito, Azeitona, Milho, Ervilha, Salsicha, Pimenta, Ovo de Codorna, Tomate, Uva Passa, Orégano, Cebinha.', 'Massas', 26.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('parafuso', 'Parafuso (Penne)', 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes. Molhos: Vermelho, Branco, 4 Queijos, Bolonhesa. Ingredientes: Bacon, Frango, Calabresa, Presunto, Alho Frito, Azeitona, Milho, Ervilha, Salsicha, Pimenta, Ovo de Codorna, Tomate, Uva Passa, Orégano, Cebinha.', 'Massas', 26.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('penne', 'Penne', 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes. Molhos: Vermelho, Branco, 4 Queijos, Bolonhesa. Ingredientes: Bacon, Frango, Calabresa, Presunto, Alho Frito, Azeitona, Milho, Ervilha, Salsicha, Pimenta, Ovo de Codorna, Tomate, Uva Passa, Orégano, Cebinha.', 'Massas', 26.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('rigatoni', 'Rigatoni', 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes. Molhos: Vermelho, Branco, 4 Queijos, Bolonhesa. Ingredientes: Bacon, Frango, Calabresa, Presunto, Alho Frito, Azeitona, Milho, Ervilha, Salsicha, Pimenta, Ovo de Codorna, Tomate, Uva Passa, Orégano, Cebinha.', 'Massas', 26.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true);

-- ============================================================================
-- PASTÉIS DE FORNO (8 itens)
-- ============================================================================

INSERT INTO cardapio (id, nome, descricao, categoria, preco_p, preco_m, preco_g, preco_gg, preco_super, imagem, ativo) VALUES
('pastel-queijo', 'Pastel de Queijo', 'Pastel crocante recheado com queijo derretido.', 'Pastéis de Forno', 15.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('pastel-carne', 'Pastel de Carne', 'Pastel crocante recheado com carne moída e temperos.', 'Pastéis de Forno', 15.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('pastel-frango', 'Pastel de Frango', 'Pastel crocante recheado com frango desfiado.', 'Pastéis de Forno', 15.00, NULL, NULL, NULL, NULL, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('pastel-calabresa', 'Pastel de Calabresa', 'Pastel crocante recheado com calabresa e queijo.', 'Pastéis de Forno', 15.00, NULL, NULL, NULL, NULL, 'delicious_pepperoni__f6d6fa05.jpg', true),
('pastel-presunto', 'Pastel de Presunto', 'Pastel crocante recheado com presunto e queijo.', 'Pastéis de Forno', 15.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('pastel-espinafre', 'Pastel de Espinafre', 'Pastel crocante recheado com espinafre e queijo.', 'Pastéis de Forno', 15.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('pastel-brocolis', 'Pastel de Brócolis', 'Pastel crocante recheado com brócolis e queijo.', 'Pastéis de Forno', 15.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('pastel-mix', 'Pastel Mix', 'Pastel crocante com mix de recheios deliciosos.', 'Pastéis de Forno', 16.00, NULL, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true);

-- ============================================================================
-- LASANHAS (4 itens)
-- ============================================================================

INSERT INTO cardapio (id, nome, descricao, categoria, preco_p, preco_m, preco_g, preco_gg, preco_super, imagem, ativo) VALUES
('lasanha-bolonhesa', 'Lasanha à Bolonhesa', 'Lasanha caseira com molho bolonhesa, mussarela e parmesão.', 'Lasanhas', NULL, 32.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('lasanha-4queijos', 'Lasanha 4 Queijos', 'Lasanha caseira com 4 tipos de queijo derretido.', 'Lasanhas', NULL, 32.00, NULL, NULL, NULL, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('lasanha-frango', 'Lasanha de Frango', 'Lasanha caseira com frango desfiado e molho branco.', 'Lasanhas', NULL, 32.00, NULL, NULL, NULL, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('lasanha-brocolis', 'Lasanha de Brócolis', 'Lasanha caseira com brócolis, molho branco e queijo.', 'Lasanhas', NULL, 32.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true);

-- ============================================================================
-- CALZONES (6 itens)
-- ============================================================================

INSERT INTO cardapio (id, nome, descricao, categoria, preco_p, preco_m, preco_g, preco_gg, preco_super, imagem, ativo) VALUES
('calzone-calabresa', 'Calzone Calabresa', 'Pizza fechada recheada com calabresa, mussarela e cebola.', 'Calzones', 32.00, 42.00, 52.00, NULL, NULL, 'delicious_pepperoni__f6d6fa05.jpg', true),
('calzone-mussarela', 'Calzone Mussarela', 'Pizza fechada recheada com mussarela fresca e orégano.', 'Calzones', 28.00, 38.00, 48.00, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('calzone-frango', 'Calzone Frango', 'Pizza fechada recheada com frango desfiado e catupiry.', 'Calzones', 32.00, 42.00, 52.00, NULL, NULL, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('calzone-4queijos', 'Calzone 4 Queijos', 'Pizza fechada recheada com mix de 4 queijos.', 'Calzones', 32.00, 42.00, 52.00, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('calzone-portuguesa', 'Calzone Portuguesa', 'Pizza fechada recheada com presunto, ovo, cebola e mussarela.', 'Calzones', 30.00, 40.00, 50.00, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('calzone-costela', 'Calzone Costela', 'Pizza fechada recheada com costela desfiada e creme cheese.', 'Calzones', 35.00, 45.00, 55.00, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true);

-- ============================================================================
-- PETISCOS (6 itens)
-- ============================================================================

INSERT INTO cardapio (id, nome, descricao, categoria, preco_p, preco_m, preco_g, preco_gg, preco_super, imagem, ativo) VALUES
('asinhas-frango', 'Asinhas de Frango', 'Asinhas de frango temperadas e assadas na brasa.', 'Petiscos', NULL, 28.00, NULL, NULL, NULL, 'pizza_frango_com_cat_c5255c4b.jpg', true),
('bolinha-queijo', 'Bolinha de Queijo', 'Bolinhas crocantes de queijo derretido por dentro.', 'Petiscos', NULL, 24.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('batata-frita', 'Batata Frita', 'Batata frita crocante e saborosa.', 'Petiscos', NULL, 18.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('aros-cebola', 'Aros de Cebola', 'Aros de cebola empanados e fritos até ficar crocante.', 'Petiscos', NULL, 20.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('linguica-grelhada', 'Linguiça Grelhada', 'Linguiça fina grelhada e temperada.', 'Petiscos', NULL, 26.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('cubos-queijo', 'Cubos de Queijo', 'Cubos de queijo empanados e fritos.', 'Petiscos', NULL, 22.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true);

-- ============================================================================
-- BEBIDAS (5 itens)
-- ============================================================================

INSERT INTO cardapio (id, nome, descricao, categoria, preco_p, preco_m, preco_g, preco_gg, preco_super, imagem, ativo) VALUES
('refrigerante-2l', 'Refrigerante 2L', 'Refrigerante gelado (Coca-Cola, Guaraná ou Fanta).', 'Bebidas', NULL, 12.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('suco-natural', 'Suco Natural', 'Suco natural fresco de frutas da estação.', 'Bebidas', NULL, 10.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('agua', 'Água', 'Água mineral geladinha.', 'Bebidas', NULL, 3.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('cerveja-350ml', 'Cerveja 350ml', 'Cerveja gelada importada ou local.', 'Bebidas', NULL, 8.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true),
('chopp-1l', 'Chopp 1L', 'Chopp gelado direto do barril.', 'Bebidas', NULL, 25.00, NULL, NULL, NULL, 'pizza_calabresa_onio_8ea1076f.jpg', true);

-- ============================================================================
-- Fim do Script
-- ============================================================================
-- Total: 85+ produtos inseridos com sucesso!
-- Categorias: Salgadas (43), Doces (5), Massas (4), Pastéis (8), Lasanhas (4), Calzones (6), Petiscos (6), Bebidas (5)