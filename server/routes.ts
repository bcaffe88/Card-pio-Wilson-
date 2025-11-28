import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCardapioSchema, insertClienteSchema, insertEnderecoSchema, insertPedidoSchema, insertItemPedidoSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // CARDÁPIO ROUTES
  app.get("/api/cardapio", async (req, res) => {
    try {
      const cardapio = await storage.getAllCardapio();
      res.json(cardapio);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cardápio" });
    }
  });

  app.get("/api/cardapio/categoria/:categoria", async (req, res) => {
    try {
      const { categoria } = req.params;
      const items = await storage.getCardapioByCategoria(categoria);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar por categoria" });
    }
  });

  app.get("/api/cardapio/buscar/:termo", async (req, res) => {
    try {
      const { termo } = req.params;
      const items = await storage.searchCardapio(termo);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });

  app.get("/api/cardapio/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await storage.getCardapio(id);
      if (!item) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  });

  // CLIENTES ROUTES
  app.post("/api/clientes", async (req, res) => {
    try {
      const data = insertClienteSchema.parse(req.body);
      
      // Normalizar telefone
      const telefoneNormalizado = data.telefone.replace(/\D/g, "");
      if (telefoneNormalizado.length < 10) {
        return res.status(400).json({ error: "Telefone inválido" });
      }

      const existe = await storage.getClienteByTelefone(telefoneNormalizado);
      if (existe) {
        return res.json(existe); // Retorna cliente existente se já cadastrado
      }

      const cliente = await storage.createCliente({
        ...data,
        telefone: telefoneNormalizado,
      });
      res.status(201).json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar cliente" });
    }
  });

  app.get("/api/clientes/buscar/:telefone", async (req, res) => {
    try {
      const { telefone } = req.params;
      const telefoneNormalizado = telefone.replace(/\D/g, "");
      const cliente = await storage.getClienteByTelefone(telefoneNormalizado);
      
      if (!cliente) {
        return res.status(404).json({ found: false, message: "Cliente não encontrado" });
      }
      res.json({ found: true, cliente });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cliente" });
    }
  });

  app.get("/api/clientes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const cliente = await storage.getCliente(id);
      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cliente" });
    }
  });

  app.put("/api/clientes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertClienteSchema.partial().parse(req.body);
      const cliente = await storage.updateCliente(id, data);
      res.json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao atualizar cliente" });
    }
  });

  // ENDEREÇOS ROUTES
  app.post("/api/enderecos", async (req, res) => {
    try {
      const data = insertEnderecoSchema.parse(req.body);
      const endereco = await storage.createEndereco(data);
      res.status(201).json(endereco);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar endereço" });
    }
  });

  app.get("/api/enderecos/:cliente_id", async (req, res) => {
    try {
      const { cliente_id } = req.params;
      const enderecos = await storage.getEnderecosByCliente(cliente_id);
      res.json(enderecos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar endereços" });
    }
  });

  app.put("/api/enderecos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertEnderecoSchema.partial().parse(req.body);
      const endereco = await storage.updateEndereco(id, data);
      res.json(endereco);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao atualizar endereço" });
    }
  });

  app.delete("/api/enderecos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEndereco(id);
      if (!deleted) {
        return res.status(404).json({ error: "Endereço não encontrado" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar endereço" });
    }
  });

  // PEDIDOS ROUTES
  app.post("/api/pedidos", async (req, res) => {
    try {
      const { cliente_nome, cliente_telefone, cliente_email, itens, endereco, forma_pagamento, observacoes } = req.body;

      // Validações básicas
      if (!cliente_nome || !cliente_telefone || !itens || !endereco || !forma_pagamento) {
        return res.status(400).json({ error: "Dados do pedido incompletos" });
      }

      if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Pedido deve ter pelo menos um item" });
      }

      // Buscar/criar cliente
      let cliente = await storage.getClienteByTelefone(cliente_telefone);
      if (!cliente) {
        cliente = await storage.createCliente({
          nome: cliente_nome,
          telefone: cliente_telefone,
          email: cliente_email,
          endereco_padrao: `${endereco.rua}, ${endereco.numero}`,
        });
      }

      // Calcular total
      let total = 0;
      for (const item of itens) {
        total += item.preco_unitario * item.quantidade;
      }

      // Criar pedido
      const pedido = await storage.createPedido({
        cliente_id: cliente.id,
        cliente_nome: cliente.nome,
        cliente_telefone: cliente.telefone,
        cliente_email: cliente.email,
        status: "pending",
        total: total.toString() as any,
        endereco_entrega: endereco,
        forma_pagamento,
        observacoes,
      });

      // Criar itens do pedido
      for (const item of itens) {
        await storage.createItemPedido({
          pedido_id: pedido.id,
          produto_nome: item.produto_nome,
          categoria: item.categoria,
          tamanho: item.tamanho,
          sabores: item.sabores,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario.toString() as any,
          observacoes: item.observacoes,
        });
      }

      res.status(201).json({
        id: pedido.id,
        numero_pedido: pedido.numero_pedido,
        cliente_id: cliente.id,
        cliente_nome: cliente.nome,
        status: pedido.status,
        total: pedido.total,
        itens_count: itens.length,
        forma_pagamento: pedido.forma_pagamento,
        created_at: pedido.created_at,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar pedido" });
    }
  });

  app.get("/api/pedidos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const pedido = await storage.getPedido(id);
      if (!pedido) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      const itens = await storage.getItensPedido(id);
      res.json({ ...pedido, itens });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pedido" });
    }
  });

  app.get("/api/pedidos/cliente/:cliente_id", async (req, res) => {
    try {
      const { cliente_id } = req.params;
      const pedidos = await storage.getPedidosByCliente(cliente_id);
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
  });

  app.put("/api/pedidos/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const statusValidos = ["pending", "confirmed", "production", "ready", "sent", "delivered", "cancelled"];
      if (!statusValidos.includes(status)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const pedido = await storage.updatePedidoStatus(id, status);
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar status" });
    }
  });

  app.get("/api/admin/pedidos", async (req, res) => {
    try {
      const pedidos = await storage.getAllPedidos();
      const pedidosComItens = await Promise.all(
        pedidos.map(async (p) => ({
          ...p,
          itens: await storage.getItensPedido(p.id),
        }))
      );
      res.json(pedidosComItens);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
  });

  // HORÁRIOS ROUTES
  app.get("/api/horarios-funcionamento", async (req, res) => {
    try {
      const horarios = await storage.getHorarios();
      res.json(horarios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar horários" });
    }
  });

  return httpServer;
}
