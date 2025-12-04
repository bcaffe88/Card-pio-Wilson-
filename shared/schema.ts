import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean, time, decimal, serial, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// CARDÁPIO
export const cardapio = pgTable("cardapio", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nome_item: text("nome_item").notNull(),
  categoria: text("categoria").notNull(),
  descricao: text("descricao"),
  precos: jsonb("precos").notNull(),
  imagem_url: text("imagem_url"),
  disponivel: boolean("disponivel").default(true),
  created_at: timestamp("created_at").default(sql`now()`),
  updated_at: timestamp("updated_at").default(sql`now()`),
});

// CLIENTES
export const clientes = pgTable("clientes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  telefone: text("telefone").notNull().unique(),
  email: text("email"),
  endereco_padrao: text("endereco_padrao"),
  created_at: timestamp("created_at").default(sql`now()`),
  updated_at: timestamp("updated_at").default(sql`now()`),
});

// ENDEREÇOS
export const enderecos = pgTable("enderecos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  cliente_id: uuid("cliente_id").notNull().references(() => clientes.id, { onDelete: "cascade" }),
  rua: text("rua").notNull(),
  numero: integer("numero").notNull(),
  bairro: text("bairro").notNull(),
  cidade: text("cidade").notNull(),
  cep: text("cep"),
  complemento: text("complemento"),
  created_at: timestamp("created_at").default(sql`now()`),
});

// PEDIDOS
export const pedidos = pgTable("pedidos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  numero_pedido: serial("numero_pedido").unique(),
  cliente_id: uuid("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
  cliente_nome: text("cliente_nome").notNull(),
  cliente_telefone: text("cliente_telefone").notNull(),
  cliente_email: text("cliente_email"),
  status: text("status").default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  endereco_entrega: jsonb("endereco_entrega").notNull(),
  forma_pagamento: text("forma_pagamento").notNull(),
  observacoes: text("observacoes"),
  viewed: boolean("viewed").default(false),
  created_at: timestamp("created_at").default(sql`now()`),
  updated_at: timestamp("updated_at").default(sql`now()`),
});

// ITENS PEDIDO
export const itens_pedido = pgTable("itens_pedido", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  pedido_id: uuid("pedido_id").notNull().references(() => pedidos.id, { onDelete: "cascade" }),
  produto_id: uuid("produto_id").references(() => cardapio.id),
  produto_nome: text("produto_nome").notNull(),
  categoria: text("categoria").notNull(),
  tamanho: text("tamanho"),
  sabores: jsonb("sabores"),
  quantidade: integer("quantidade").default(1),
  preco_unitario: decimal("preco_unitario", { precision: 10, scale: 2 }).notNull(),
  observacoes: text("observacoes"),
  created_at: timestamp("created_at").default(sql`now()`),
});

// HORÁRIOS FUNCIONAMENTO
export const horarios_funcionamento = pgTable("horarios_funcionamento", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  dia_semana: text("dia_semana").notNull().unique(),
  abertura: time("abertura").notNull(),
  fechamento: time("fechamento").notNull(),
  aberto: boolean("aberto").default(true),
  created_at: timestamp("created_at").default(sql`now()`),
});

// CONFIGURAÇÕES DO RESTAURANTE
export const configuracoes = pgTable("configuracoes", {
  // Usamos um ID fixo para garantir que haja apenas uma linha nesta tabela
  id: integer("id").primaryKey().default(1),
  nome_restaurante: text("nome_restaurante").notNull(),
  endereco: text("endereco"),
  telefone: text("telefone"),
  logo_url: text("logo_url"),
  updated_at: timestamp("updated_at").default(sql`now()`),
});

// SCHEMAS DRIZZLE-ZOD
export const insertCardapioSchema = createInsertSchema(cardapio).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertClienteSchema = createInsertSchema(clientes).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertEnderecoSchema = createInsertSchema(enderecos).omit({
  id: true,
  created_at: true,
});

export const insertPedidoSchema = createInsertSchema(pedidos).omit({
  id: true,
  numero_pedido: true,
  created_at: true,
  updated_at: true,
});

export const insertItemPedidoSchema = createInsertSchema(itens_pedido).omit({
  id: true,
  created_at: true,
});

export const insertHorarioSchema = createInsertSchema(horarios_funcionamento).omit({
  id: true,
  created_at: true,
});

export const insertConfiguracoesSchema = createInsertSchema(configuracoes).omit({
  id: true,
  updated_at: true,
});

// TYPES
export type Cardapio = typeof cardapio.$inferSelect;
export type InsertCardapio = z.infer<typeof insertCardapioSchema>;

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = z.infer<typeof insertClienteSchema>;

export type Endereco = typeof enderecos.$inferSelect;
export type InsertEndereco = z.infer<typeof insertEnderecoSchema>;

export type Pedido = typeof pedidos.$inferSelect;
export type InsertPedido = z.infer<typeof insertPedidoSchema>;

export type ItemPedido = typeof itens_pedido.$inferSelect;
export type InsertItemPedido = z.infer<typeof insertItemPedidoSchema>;

export type HorarioFuncionamento = typeof horarios_funcionamento.$inferSelect;
export type InsertHorario = z.infer<typeof insertHorarioSchema>;

export type Configuracoes = typeof configuracoes.$inferSelect;
export type InsertConfiguracoes = z.infer<typeof insertConfiguracoesSchema>;

// STATUS TYPE
export type OrderStatus = "pending" | "confirmed" | "production" | "ready" | "sent" | "delivered" | "cancelled";
