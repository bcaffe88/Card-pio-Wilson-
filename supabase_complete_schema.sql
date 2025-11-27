-- SCHEMA COMPLETO PARA WILSON PIZZA

-- Tabela: CLIENTES
CREATE TABLE public.clientes (
  id uuid not null default extensions.uuid_generate_v4(),
  nome text not null,
  telefone text not null unique,
  email text,
  endereco_padrao text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint clientes_pkey primary key (id)
) TABLESPACE pg_default;

CREATE INDEX idx_clientes_telefone ON public.clientes USING btree (telefone);
CREATE INDEX idx_clientes_nome ON public.clientes USING btree (nome);

-- Tabela: ENDERECOS
CREATE TABLE public.enderecos (
  id uuid not null default extensions.uuid_generate_v4(),
  cliente_id uuid not null,
  rua text not null,
  numero text not null,
  bairro text not null,
  cidade text not null,
  cep text,
  complemento text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint enderecos_pkey primary key (id),
  constraint fk_cliente foreign key (cliente_id) references clientes(id) on delete cascade
) TABLESPACE pg_default;

CREATE INDEX idx_enderecos_cliente ON public.enderecos USING btree (cliente_id);

-- Tabela: CARDAPIO (Atualizada)
CREATE TABLE public.cardapio (
  id uuid not null default extensions.uuid_generate_v4(),
  nome_item text not null,
  categoria text not null,
  descricao text,
  imagem_url text,
  precos jsonb not null, -- {"P": 30, "M": 38, "G": 44, "GG": 54, "Super": 60}
  disponivel boolean default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint cardapio_pkey primary key (id)
) TABLESPACE pg_default;

CREATE INDEX idx_cardapio_categoria ON public.cardapio USING btree (categoria);
CREATE INDEX idx_cardapio_disponivel ON public.cardapio USING btree (disponivel);

-- Tabela: HORARIOS_FUNCIONAMENTO
CREATE TABLE public.horarios_funcionamento (
  id uuid not null default extensions.uuid_generate_v4(),
  dia_semana text not null, -- Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo
  abertura time not null,
  fechamento time not null,
  aberto boolean default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint horarios_pkey primary key (id),
  constraint unique_dia unique (dia_semana)
) TABLESPACE pg_default;

-- Tabela: PEDIDOS
CREATE TABLE public.pedidos (
  id uuid not null default extensions.uuid_generate_v4(),
  cliente_id uuid,
  cliente_nome text not null,
  cliente_telefone text not null,
  status text default 'pending', -- pending, confirmed, production, ready, sent, delivered, cancelled
  total numeric(10,2) not null,
  endereco_entrega text,
  forma_pagamento text, -- pix, cartao, dinheiro
  observacoes text,
  criado_em timestamp with time zone default now(),
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint pedidos_pkey primary key (id),
  constraint fk_cliente_pedido foreign key (cliente_id) references clientes(id) on delete set null
) TABLESPACE pg_default;

CREATE INDEX idx_pedidos_status ON public.pedidos USING btree (status);
CREATE INDEX idx_pedidos_cliente ON public.pedidos USING btree (cliente_id);
CREATE INDEX idx_pedidos_telefone ON public.pedidos USING btree (cliente_telefone);

-- Tabela: ITENS_PEDIDO
CREATE TABLE public.itens_pedido (
  id uuid not null default extensions.uuid_generate_v4(),
  pedido_id uuid not null,
  produto_nome text not null,
  tamanho text, -- P, M, G, GG, Super
  sabores text, -- JSON ou texto separado por vírgula
  massa text, -- fina, media, grossa
  borda text, -- sem-borda, catupiry, etc
  quantidade integer default 1,
  preco_unitario numeric(10,2) not null,
  observacoes text,
  created_at timestamp with time zone null default now(),
  constraint itens_pedido_pkey primary key (id),
  constraint fk_pedido foreign key (pedido_id) references pedidos(id) on delete cascade
) TABLESPACE pg_default;

CREATE INDEX idx_itens_pedido_pedido ON public.itens_pedido USING btree (pedido_id);

-- ============================================
-- INSERIR DADOS DO CARDÁPIO
-- ============================================

-- PIZZAS SALGADAS
INSERT INTO public.cardapio (nome_item, categoria, descricao, imagem_url, precos, disponivel) VALUES
('Costela', 'Salgadas', 'Costela desfiada, cebola, creme cheese, mussarela e barbecue.', 'https://menu-online--brunocaffe.replit.app/images/costela.jpg', '{"P": 35, "M": 45, "G": 65, "GG": 80}', true),
('Calabresa Especial', 'Salgadas', 'Molho de tomate, calabresa fatiada, mussarela, creme cheese, barbecue, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/calabresa.jpg', '{"P": 32, "M": 42, "G": 53, "GG": 73}', true),
('Carne de Sol', 'Salgadas', 'Molho de tomate, carne de sol desfiada, cebola fatiada, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/carne-de-sol.jpg', '{"P": 34, "M": 44, "G": 60, "Super": 80}', true),
('À Moda do Chefe', 'Salgadas', 'Molho de tomate, lombo canadense, bacon, mussarela, champignon, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/moda-chefe.jpg', '{"P": 28, "M": 38, "G": 62, "Super": 75}', true),
('Espanhola', 'Salgadas', 'Molho de tomate, calabresa moída, ovos cozidos, cebola, pimentão fatiado, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/espanhola.jpg', '{"P": 28, "M": 38, "G": 50, "Super": 65}', true),
('Peperone', 'Salgadas', 'Molho de tomate, mussarela, salaminho tipo peperone, parmesão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/peperone.jpg', '{"P": 28.50, "M": 38, "G": 50, "Super": 60}', true),
('Camarão', 'Salgadas', 'Molho de tomate, mussarela, filé de camarão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/camarao.jpg', '{"P": 35, "M": 45, "G": 62, "Super": 80}', true),
('Frango Bolonhesa', 'Salgadas', 'Molho de tomate, frango desfiado, queijo parmesão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/frango-bolonhesa.jpg', '{"P": 32, "M": 42, "G": 56, "Super": 75}', true),
('Siciliana', 'Salgadas', 'Molho de tomate, mussarela, champignon.', 'https://menu-online--brunocaffe.replit.app/images/siciliana.jpg', '{"P": 28, "M": 38, "G": 50, "Super": 70}', true),
('Nordestina', 'Salgadas', 'Molho de tomate, carne de charque desfiada, cebola, pimentão, pimenta de cheiro, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/nordestina.jpg', '{"P": 32, "M": 42, "G": 62, "Super": 80}', true),
('À Sua Moda', 'Salgadas', 'Ingredientes sugeridos pelo cliente.', 'https://menu-online--brunocaffe.replit.app/images/sua-moda.jpg', '{"P": 35, "M": 45, "G": 64, "Super": 80}', true),
('Vegetariana', 'Salgadas', 'Molho de tomate, mussarela, palmito, tomate fatiado, pimentão, champignon, manjericão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/vegetariana.jpg', '{"P": 30, "M": 40, "G": 48, "Super": 60}', true),
('Caipira', 'Salgadas', 'Molho de tomate, frango desfiado, milho verde, catupiry, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/caipira.jpg', '{"P": 32, "M": 42, "G": 53, "Super": 73}', true),
('Toscana', 'Salgadas', 'Molho de tomate, calabresa moída, cebola, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/toscana.jpg', '{"P": 28, "M": 38, "G": 44, "Super": 60}', true),
('4 Queijos', 'Salgadas', 'Molho de tomate, mussarela, provolone, catupiry, parmesão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/4queijos.jpg', '{"P": 28, "M": 41, "G": 48, "Super": 62}', true),
('À Moda do Forneiro', 'Salgadas', 'Molho de tomate, carne de sol desfiada, champignon, palmito, catupiry, manjericão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/forneiro.jpg', '{"P": 32, "M": 42, "G": 54, "Super": 73}', true),
('Bolonhesa', 'Salgadas', 'Molho de tomate, mussarela, molho bolonhesa, parmesão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/bolonhesa.jpg', '{"P": 28, "M": 38, "G": 48, "Super": 55}', true),
('Palmito', 'Salgadas', 'Molho de tomate, palmito picado e temperado, catupiry, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/palmito.jpg', '{"P": 28, "M": 38, "G": 53, "Super": 60}', true),
('À Moda do Pizzaiolo', 'Salgadas', 'Molho de tomate, presunto picado, palmito, ervilha, mussarela, bacon, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/pizzaiolo.jpg', '{"P": 32, "M": 42, "G": 52, "Super": 73}', true),
('Marguerita', 'Salgadas', 'Molho de tomate, mussarela, manjericão, rodelas de tomate, parmesão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/marguerita.jpg', '{"P": 28, "M": 38, "G": 48, "Super": 55}', true),
('Verona', 'Salgadas', 'Molho de tomate, palmito, bacon, catupiry, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/verona.jpg', '{"P": 28, "M": 38, "G": 52, "Super": 65}', true),
('Formágio', 'Salgadas', 'Molho de tomate, mussarela, provolone, catupiry, gorgonzola, parmesão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/formagio.jpg', '{"P": 28, "M": 38, "G": 50, "Super": 60}', true),
('Hot Dog', 'Salgadas', 'Salsicha, milho, catupiry, mussarela e batata palha.', 'https://menu-online--brunocaffe.replit.app/images/hotdog.jpg', '{"P": 28, "M": 38, "G": 47, "Super": 60}', true),
('À Grega', 'Salgadas', 'Molho de tomate, mussarela, catupiry, calabresa fatiada, bacon, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/grega.jpg', '{"P": 28, "M": 41, "G": 56, "Super": 61}', true),
('Napolitana', 'Salgadas', 'Molho de tomate, mussarela, rodelas de tomate, parmesão, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/napolitana.jpg', '{"P": 28, "M": 38, "G": 45, "Super": 54}', true),
('Atum', 'Salgadas', 'Molho de tomate, atum sólido, cebola, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/atum.jpg', '{"P": 32, "M": 42, "G": 45, "Super": 65}', true),
('Atum c/ Cream Cheese', 'Salgadas', 'Molho de tomate, atum, cebola, cream cheese, orégano.', 'https://menu-online--brunocaffe.replit.app/images/atum-cream.jpg', '{"P": 35, "M": 45, "G": 53, "Super": 73}', true),
('Agreste', 'Salgadas', 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/agreste.jpg', '{"P": 32, "M": 42, "G": 60, "Super": 73}', true),
('Charque', 'Salgadas', 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/charque.jpg', '{"P": 32, "M": 42, "G": 60, "Super": 73}', true),
('Suíça', 'Salgadas', 'Molho de tomate, presunto, mussarela, gorgonzola, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/suica.jpg', '{"P": 30, "M": 40, "G": 45, "Super": 60}', true),
('Carne de Sol c/ Cream Cheese', 'Salgadas', 'Molho de tomate, carne de sol, cebola, orégano, Cream X e Bacon Fatiado.', 'https://menu-online--brunocaffe.replit.app/images/carnesol-cream.jpg', '{"P": 32, "M": 45, "G": 62, "Super": 73}', true),
('Strogonoff', 'Salgadas', 'Molho de tomate, mussarela, strogonoff.', 'https://menu-online--brunocaffe.replit.app/images/strogonoff.jpg', '{"P": 32, "M": 42, "G": 53, "Super": 65}', true),
('Frango c/ Cream Cheese', 'Salgadas', 'Molho de tomate, frango desfiado, mussarela.', 'https://menu-online--brunocaffe.replit.app/images/frango-cream.jpg', '{"P": 35, "M": 45, "G": 60, "Super": 73}', true),
('Mussarela', 'Salgadas', 'Molho de tomate, mussarela, rodelas de tomate, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/mussarela.jpg', '{"P": 28, "M": 38, "G": 44, "Super": 54}', true),
('Calabresa', 'Salgadas', 'Molho de tomate, calabresa, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/calabresa2.jpg', '{"P": 28, "M": 38, "G": 46, "Super": 60}', true),
('Portuguesa', 'Salgadas', 'Molho de tomate, presunto, ovos, cebola, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/portuguesa.jpg', '{"P": 30, "M": 40, "G": 50, "Super": 65}', true),
('Bauru', 'Salgadas', 'Molho de tomate, presunto, mussarela, rodelas de tomate, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/bauru.jpg', '{"P": 28, "M": 38, "G": 44, "Super": 60}', true),
('Frango c/ Mussarela', 'Salgadas', 'Molho de tomate, frango desfiado, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/frango-muss.jpg', '{"P": 32, "M": 42, "G": 55, "Super": 75}', true),
('Frango c/ Catupiry', 'Salgadas', 'Molho de tomate, frango desfiado, catupiry, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/frango-catupiry.jpg', '{"P": 32, "M": 42, "G": 55, "Super": 75}', true),
('Bacon', 'Salgadas', 'Molho de tomate, mussarela, bacon, rodelas de tomate, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/bacon.jpg', '{"P": 32, "M": 42, "G": 55, "Super": 70}', true),
('À Moda da Casa', 'Salgadas', 'Molho de tomate, frango desfiado, milho verde, mussarela, bacon, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/moda-casa.jpg', '{"P": 32, "M": 42, "G": 62, "Super": 80}', true),
('Francesa', 'Salgadas', 'Molho de tomate, presunto, ovos, cebola, ervilha, catupiry, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/francesa.jpg', '{"P": 30, "M": 40, "G": 50, "Super": 65}', true),
('Baiana', 'Salgadas', 'Molho de tomate, calabresa moída, ovos cozidos, pimenta calabresa, cebola, mussarela, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/baiana.jpg', '{"P": 30, "M": 40, "G": 50, "Super": 65}', true),
('Sertaneja', 'Salgadas', 'Molho de tomate, mussarela, calabresa, milho verde, cebola, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/sertaneja.jpg', '{"P": 28, "M": 38, "G": 46, "Super": 60}', true),
('Alho', 'Salgadas', 'Molho de tomate, mussarela, parmesão, alho frito, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/alho.jpg', '{"P": 28, "M": 38, "G": 46, "Super": 60}', true),
('Lombinho', 'Salgadas', 'Molho de tomate, mussarela, lombo canadense, cebola fatiada, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/lombinho.jpg', '{"P": 28, "M": 38, "G": 50, "Super": 62}', true),
('Veneza', 'Salgadas', 'Molho de tomate, lombo canadense, alho frito, catupiry, orégano e azeitonas.', 'https://menu-online--brunocaffe.replit.app/images/veneza.jpg', '{"P": 28, "M": 38, "G": 50, "Super": 62}', true);

-- PIZZAS DOCES
INSERT INTO public.cardapio (nome_item, categoria, descricao, imagem_url, precos, disponivel) VALUES
('Chocolate com Morango', 'Doces', 'Chocolate com morango.', 'https://menu-online--brunocaffe.replit.app/images/chocolate-morango.jpg', '{"P": 30, "M": 35, "G": 40, "GG": 54}', true),
('Banana Nevada', 'Doces', 'Banana com canela, creme de leite e chocolate branco com borda de doce de leite.', 'https://menu-online--brunocaffe.replit.app/images/banana-nevada.jpg', '{"P": 30, "M": 35, "G": 40, "GG": 54}', true),
('Cartola', 'Doces', 'Mussarela, catupiry, banana fatiada, açúcar e canela com borda de doce de leite.', 'https://menu-online--brunocaffe.replit.app/images/cartola.jpg', '{"P": 30, "M": 35, "G": 40, "GG": 54}', true),
('Romeu e Julieta', 'Doces', 'Mussarela coberta com fatia de goiabada, com borda de doce de leite.', 'https://menu-online--brunocaffe.replit.app/images/romeu-julieta.jpg', '{"P": 30, "M": 35, "G": 40, "GG": 54}', true),
('Dois Amores', 'Doces', 'Chocolate branco e chocolate de avelã com borda de doce de leite.', 'https://menu-online--brunocaffe.replit.app/images/dois-amores.jpg', '{"P": 30, "M": 35, "G": 40, "GG": 54}', true);

-- HORÁRIOS DE FUNCIONAMENTO
INSERT INTO public.horarios_funcionamento (dia_semana, abertura, fechamento, aberto) VALUES
('Segunda', '10:00:00', '23:00:00', true),
('Terça', '10:00:00', '23:00:00', true),
('Quarta', '10:00:00', '23:00:00', true),
('Quinta', '10:00:00', '23:00:00', true),
('Sexta', '10:00:00', '00:00:00', true),
('Sábado', '10:00:00', '00:00:00', true),
('Domingo', '10:00:00', '00:00:00', true);
