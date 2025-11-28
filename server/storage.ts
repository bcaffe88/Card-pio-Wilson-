import { db } from "./db";
import {
  cardapio,
  clientes,
  enderecos,
  pedidos,
  itens_pedido,
  horarios_funcionamento,
} from "@shared/schema";
import {
  type Cardapio,
  type InsertCardapio,
  type Cliente,
  type InsertCliente,
  type Endereco,
  type InsertEndereco,
  type Pedido,
  type InsertPedido,
  type ItemPedido,
  type InsertItemPedido,
  type HorarioFuncionamento,
  type InsertHorario,
  type OrderStatus,
} from "@shared/schema";
import { eq, like, ilike } from "drizzle-orm";

export interface IStorage {
  getCardapio(id: string): Promise<Cardapio | undefined>;
  getAllCardapio(): Promise<Cardapio[]>;
  getCardapioByCategoria(categoria: string): Promise<Cardapio[]>;
  searchCardapio(termo: string): Promise<Cardapio[]>;
  getCliente(id: string): Promise<Cliente | undefined>;
  getClienteByTelefone(telefone: string): Promise<Cliente | undefined>;
  createCliente(cliente: InsertCliente): Promise<Cliente>;
  updateCliente(id: string, cliente: Partial<InsertCliente>): Promise<Cliente>;
  getEndereco(id: string): Promise<Endereco | undefined>;
  getEnderecosByCliente(cliente_id: string): Promise<Endereco[]>;
  createEndereco(endereco: InsertEndereco): Promise<Endereco>;
  updateEndereco(id: string, endereco: Partial<InsertEndereco>): Promise<Endereco>;
  deleteEndereco(id: string): Promise<boolean>;
  getPedido(id: string): Promise<Pedido | undefined>;
  getPedidosByCliente(cliente_id: string): Promise<Pedido[]>;
  getAllPedidos(): Promise<Pedido[]>;
  createPedido(pedido: InsertPedido): Promise<Pedido>;
  updatePedidoStatus(id: string, status: OrderStatus): Promise<Pedido>;
  markPedidoAsViewed(id: string): Promise<void>;
  getItensPedido(pedido_id: string): Promise<ItemPedido[]>;
  createItemPedido(item: InsertItemPedido): Promise<ItemPedido>;
  getHorarios(): Promise<HorarioFuncionamento[]>;
  updateHorario(id: string, horario: Partial<InsertHorario>): Promise<HorarioFuncionamento>;
}

export class SupabaseStorage implements IStorage {
  async getCardapio(id: string): Promise<Cardapio | undefined> {
    const result = await db.select().from(cardapio).where(eq(cardapio.id, id));
    return result[0];
  }

  async getAllCardapio(): Promise<Cardapio[]> {
    return await db.select().from(cardapio).where(eq(cardapio.disponivel, true));
  }

  async getCardapioByCategoria(categoria: string): Promise<Cardapio[]> {
    return await db
      .select()
      .from(cardapio)
      .where(eq(cardapio.categoria, categoria));
  }

  async searchCardapio(termo: string): Promise<Cardapio[]> {
    return await db
      .select()
      .from(cardapio)
      .where(ilike(cardapio.nome_item, `%${termo}%`));
  }

  async getCliente(id: string): Promise<Cliente | undefined> {
    const result = await db.select().from(clientes).where(eq(clientes.id, id));
    return result[0];
  }

  async getClienteByTelefone(telefone: string): Promise<Cliente | undefined> {
    const result = await db
      .select()
      .from(clientes)
      .where(eq(clientes.telefone, telefone));
    return result[0];
  }

  async createCliente(cliente: InsertCliente): Promise<Cliente> {
    const result = await db.insert(clientes).values(cliente).returning();
    return result[0];
  }

  async updateCliente(id: string, updates: Partial<InsertCliente>): Promise<Cliente> {
    const result = await db
      .update(clientes)
      .set(updates)
      .where(eq(clientes.id, id))
      .returning();
    if (!result.length) throw new Error("Cliente não encontrado");
    return result[0];
  }

  async getEndereco(id: string): Promise<Endereco | undefined> {
    const result = await db.select().from(enderecos).where(eq(enderecos.id, id));
    return result[0];
  }

  async getEnderecosByCliente(cliente_id: string): Promise<Endereco[]> {
    return await db
      .select()
      .from(enderecos)
      .where(eq(enderecos.cliente_id, cliente_id));
  }

  async createEndereco(endereco: InsertEndereco): Promise<Endereco> {
    const result = await db.insert(enderecos).values(endereco).returning();
    return result[0];
  }

  async updateEndereco(id: string, updates: Partial<InsertEndereco>): Promise<Endereco> {
    const result = await db
      .update(enderecos)
      .set(updates)
      .where(eq(enderecos.id, id))
      .returning();
    if (!result.length) throw new Error("Endereço não encontrado");
    return result[0];
  }

  async deleteEndereco(id: string): Promise<boolean> {
    const result = await db.delete(enderecos).where(eq(enderecos.id, id));
    return true;
  }

  async getPedido(id: string): Promise<Pedido | undefined> {
    const result = await db.select().from(pedidos).where(eq(pedidos.id, id));
    return result[0];
  }

  async getPedidosByCliente(cliente_id: string): Promise<Pedido[]> {
    return await db
      .select()
      .from(pedidos)
      .where(eq(pedidos.cliente_id, cliente_id));
  }

  async getAllPedidos(): Promise<Pedido[]> {
    return await db.select().from(pedidos);
  }

  async createPedido(pedido: InsertPedido): Promise<Pedido> {
    const result = await db.insert(pedidos).values(pedido).returning();
    return result[0];
  }

  async updatePedidoStatus(id: string, status: OrderStatus): Promise<Pedido> {
    const result = await db
      .update(pedidos)
      .set({ status, updated_at: new Date() })
      .where(eq(pedidos.id, id))
      .returning();
    if (!result.length) throw new Error("Pedido não encontrado");
    return result[0];
  }

  async markPedidoAsViewed(id: string): Promise<void> {
    await db.update(pedidos).set({ viewed: true }).where(eq(pedidos.id, id));
  }

  async getItensPedido(pedido_id: string): Promise<ItemPedido[]> {
    return await db
      .select()
      .from(itens_pedido)
      .where(eq(itens_pedido.pedido_id, pedido_id));
  }

  async createItemPedido(item: InsertItemPedido): Promise<ItemPedido> {
    const result = await db.insert(itens_pedido).values(item).returning();
    return result[0];
  }

  async getHorarios(): Promise<HorarioFuncionamento[]> {
    return await db.select().from(horarios_funcionamento);
  }

  async updateHorario(id: string, updates: Partial<InsertHorario>): Promise<HorarioFuncionamento> {
    const result = await db
      .update(horarios_funcionamento)
      .set(updates)
      .where(eq(horarios_funcionamento.id, id))
      .returning();
    if (!result.length) throw new Error("Horário não encontrado");
    return result[0];
  }
}

export const storage = new SupabaseStorage();
