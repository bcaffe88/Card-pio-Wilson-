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

export interface IStorage {
  // CARDÁPIO
  getCardapio(id: string): Promise<Cardapio | undefined>;
  getAllCardapio(): Promise<Cardapio[]>;
  getCardapioByCategoria(categoria: string): Promise<Cardapio[]>;
  searchCardapio(termo: string): Promise<Cardapio[]>;

  // CLIENTES
  getCliente(id: string): Promise<Cliente | undefined>;
  getClienteByTelefone(telefone: string): Promise<Cliente | undefined>;
  createCliente(cliente: InsertCliente): Promise<Cliente>;
  updateCliente(id: string, cliente: Partial<InsertCliente>): Promise<Cliente>;

  // ENDEREÇOS
  getEndereco(id: string): Promise<Endereco | undefined>;
  getEnderecosByCliente(cliente_id: string): Promise<Endereco[]>;
  createEndereco(endereco: InsertEndereco): Promise<Endereco>;
  updateEndereco(id: string, endereco: Partial<InsertEndereco>): Promise<Endereco>;
  deleteEndereco(id: string): Promise<boolean>;

  // PEDIDOS
  getPedido(id: string): Promise<Pedido | undefined>;
  getPedidosByCliente(cliente_id: string): Promise<Pedido[]>;
  getAllPedidos(): Promise<Pedido[]>;
  createPedido(pedido: InsertPedido): Promise<Pedido>;
  updatePedidoStatus(id: string, status: OrderStatus): Promise<Pedido>;
  markPedidoAsViewed(id: string): Promise<void>;

  // ITENS PEDIDO
  getItensPedido(pedido_id: string): Promise<ItemPedido[]>;
  createItemPedido(item: InsertItemPedido): Promise<ItemPedido>;

  // HORÁRIOS
  getHorarios(): Promise<HorarioFuncionamento[]>;
  updateHorario(id: string, horario: Partial<InsertHorario>): Promise<HorarioFuncionamento>;
}

export class MemStorage implements IStorage {
  private cardapios: Map<string, Cardapio> = new Map();
  private clientes: Map<string, Cliente> = new Map();
  private enderecos: Map<string, Endereco> = new Map();
  private pedidos: Map<string, Pedido> = new Map();
  private itens_pedido: Map<string, ItemPedido> = new Map();
  private horarios: Map<string, HorarioFuncionamento> = new Map();
  private nextNumeroPedido = 1;

  async getCardapio(id: string): Promise<Cardapio | undefined> {
    return this.cardapios.get(id);
  }

  async getAllCardapio(): Promise<Cardapio[]> {
    return Array.from(this.cardapios.values());
  }

  async getCardapioByCategoria(categoria: string): Promise<Cardapio[]> {
    return Array.from(this.cardapios.values()).filter(c => c.categoria === categoria);
  }

  async searchCardapio(termo: string): Promise<Cardapio[]> {
    const lower = termo.toLowerCase();
    return Array.from(this.cardapios.values()).filter(c =>
      c.nome_item.toLowerCase().includes(lower) ||
      c.descricao?.toLowerCase().includes(lower)
    );
  }

  async getCliente(id: string): Promise<Cliente | undefined> {
    return this.clientes.get(id);
  }

  async getClienteByTelefone(telefone: string): Promise<Cliente | undefined> {
    return Array.from(this.clientes.values()).find(c => c.telefone === telefone);
  }

  async createCliente(cliente: InsertCliente): Promise<Cliente> {
    const id = crypto.randomUUID();
    const now = new Date();
    const newCliente: Cliente = {
      ...cliente,
      id,
      created_at: now,
      updated_at: now,
    };
    this.clientes.set(id, newCliente);
    return newCliente;
  }

  async updateCliente(id: string, cliente: Partial<InsertCliente>): Promise<Cliente> {
    const existing = this.clientes.get(id);
    if (!existing) throw new Error("Cliente não encontrado");
    const updated = { ...existing, ...cliente, updated_at: new Date() };
    this.clientes.set(id, updated);
    return updated;
  }

  async getEndereco(id: string): Promise<Endereco | undefined> {
    return this.enderecos.get(id);
  }

  async getEnderecosByCliente(cliente_id: string): Promise<Endereco[]> {
    return Array.from(this.enderecos.values()).filter(e => e.cliente_id === cliente_id);
  }

  async createEndereco(endereco: InsertEndereco): Promise<Endereco> {
    const id = crypto.randomUUID();
    const newEndereco: Endereco = {
      ...endereco,
      id,
      created_at: new Date(),
    };
    this.enderecos.set(id, newEndereco);
    return newEndereco;
  }

  async updateEndereco(id: string, endereco: Partial<InsertEndereco>): Promise<Endereco> {
    const existing = this.enderecos.get(id);
    if (!existing) throw new Error("Endereço não encontrado");
    const updated = { ...existing, ...endereco };
    this.enderecos.set(id, updated);
    return updated;
  }

  async deleteEndereco(id: string): Promise<boolean> {
    return this.enderecos.delete(id);
  }

  async getPedido(id: string): Promise<Pedido | undefined> {
    return this.pedidos.get(id);
  }

  async getPedidosByCliente(cliente_id: string): Promise<Pedido[]> {
    return Array.from(this.pedidos.values()).filter(p => p.cliente_id === cliente_id);
  }

  async getAllPedidos(): Promise<Pedido[]> {
    return Array.from(this.pedidos.values());
  }

  async createPedido(pedido: InsertPedido): Promise<Pedido> {
    const id = crypto.randomUUID();
    const numero_pedido = this.nextNumeroPedido++;
    const now = new Date();
    const newPedido: Pedido = {
      ...pedido,
      id,
      numero_pedido,
      created_at: now,
      updated_at: now,
    } as Pedido;
    this.pedidos.set(id, newPedido);
    return newPedido;
  }

  async updatePedidoStatus(id: string, status: OrderStatus): Promise<Pedido> {
    const existing = this.pedidos.get(id);
    if (!existing) throw new Error("Pedido não encontrado");
    const updated = { ...existing, status, updated_at: new Date() };
    this.pedidos.set(id, updated);
    return updated;
  }

  async markPedidoAsViewed(id: string): Promise<void> {
    const existing = this.pedidos.get(id);
    if (existing) {
      this.pedidos.set(id, { ...existing, viewed: true });
    }
  }

  async getItensPedido(pedido_id: string): Promise<ItemPedido[]> {
    return Array.from(this.itens_pedido.values()).filter(i => i.pedido_id === pedido_id);
  }

  async createItemPedido(item: InsertItemPedido): Promise<ItemPedido> {
    const id = crypto.randomUUID();
    const newItem: ItemPedido = {
      ...item,
      id,
      created_at: new Date(),
    };
    this.itens_pedido.set(id, newItem);
    return newItem;
  }

  async getHorarios(): Promise<HorarioFuncionamento[]> {
    return Array.from(this.horarios.values());
  }

  async updateHorario(id: string, horario: Partial<InsertHorario>): Promise<HorarioFuncionamento> {
    const existing = this.horarios.get(id);
    if (!existing) throw new Error("Horário não encontrado");
    const updated = { ...existing, ...horario };
    this.horarios.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
