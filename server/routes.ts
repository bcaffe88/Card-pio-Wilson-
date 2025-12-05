import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { uploadFileToSupabase } from "./storage";
import { db } from "./db";
import { cardapio, clientes, configuracoes, insertCardapioSchema, insertClienteSchema } from "@shared/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Configuração do Multer para usar a memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB por arquivo
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  
  // ROTA DE UPLOAD DE IMAGEM
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      const file = req.file;
      const bucketName = "imagens-cardapio"; // Nome do seu bucket no Supabase

      const publicUrl = await uploadFileToSupabase(
        bucketName,
        file.originalname,
        file.buffer,
        file.mimetype,
      );

      res.json({ publicUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Erro ao fazer upload da imagem.", details: error.message });
    }
  });

  // ROTAS DE CONFIGURAÇÕES
  app.get("/api/configuracoes", async (req, res) => {
    try {
      const result = await db.query.configuracoes.findFirst({
        where: eq(configuracoes.id, 1)
      });
      res.json(result);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar configurações.", details: error.message });
    }
  });

  app.put("/api/configuracoes", async (req, res) => {
    try {
      const data = req.body;
      const result = await db.insert(configuracoes).values({ 
        id: 1, 
        ...data 
      }).onConflictDoUpdate({
        target: configuracoes.id,
        set: { ...data, updated_at: new Date() }
      }).returning();
      
      res.json(result[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Erro ao salvar configurações.", details: error.message });
    }
  });

  // CARDÁPIO ROUTES
  app.get("/api/cardapio", async (req, res) => {
    try {
      const cardapioResult = await db.select().from(cardapio);
      res.json(cardapioResult);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cardápio" });
    }
  });

  app.get("/api/cardapio/categoria/:categoria", async (req, res) => {
    try {
      const { categoria: categoriaParam } = req.params;
      const items = await db.select().from(cardapio).where(eq(cardapio.categoria, categoriaParam));
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar por categoria" });
    }
  });

  app.get("/api/cardapio/buscar/:termo", async (req, res) => {
    try {
      const { termo } = req.params;
      const items = await db.select().from(cardapio).where(eq(cardapio.nome_item, termo));
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });

  app.get("/api/cardapio/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.select().from(cardapio).where(eq(cardapio.id, id));
      if (!item.length) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      res.json(item[0]);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  });

  app.put("/api/cardapio/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertCardapioSchema.partial().parse(req.body);
      
      // Correção para o campo de imagem que vem como 'image' do frontend
      const updateData: any = { ...data };
      if (req.body.image !== undefined) {
        updateData.imagem_url = req.body.image;
      }

      const updatedProduct = await db.update(cardapio)
        .set({ ...updateData, updated_at: new Date() })
        .where(eq(cardapio.id, id))
        .returning();

      if (updatedProduct.length === 0) {
        return res.status(404).json({ error: "Produto não encontrado para atualizar" });
      }

      res.json(updatedProduct[0]);
    } catch (error: any) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Dados inválidos.", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao atualizar produto.", details: error.message });
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

      const existe = await db.select().from(clientes).where(eq(clientes.telefone, telefoneNormalizado));
      if (existe.length) {
        return res.json(existe[0]); // Retorna cliente existente se já cadastrado
      }

      const cliente = await db.insert(clientes).values({
        ...data,
        telefone: telefoneNormalizado,
      }).returning();
      res.status(201).json(cliente[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar cliente" });
    }
  });

  app.get("/api/clientes/buscar/:telefone", async (req, res) => {
    try {
      const { telefone } = req.params;
      const telefoneNormalizado = telefone.replace(/\D/g, "");
      const cliente = await db.select().from(clientes).where(eq(clientes.telefone, telefoneNormalizado));
      
      if (!cliente.length) {
        return res.status(404).json({ found: false, message: "Cliente não encontrado" });
      }
      res.json({ found: true, cliente: cliente[0] });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cliente" });
    }
  });

  app.get("/api/clientes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const cliente = await db.select().from(clientes).where(eq(clientes.id, id));
      if (!cliente.length) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      res.json(cliente[0]);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cliente" });
    }
  });

  app.put("/api/clientes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertClienteSchema.partial().parse(req.body);
      const cliente = await db.update(clientes).set(data).where(eq(clientes.id, id)).returning();
      res.json(cliente[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao atualizar cliente" });
    }
  });

  // ENDEREÇOS ROUTES
  app.post("/api/enderecos", async (req, res) => {
    try {
      const data = insertEnderecoSchema.parse(req.body);
      const endereco = await db.insert(enderecos).values(data).returning();
      res.status(201).json(endereco[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar endereço" });
    }
  });

  app.get("/api/enderecos/:cliente_id", async (req, res) => {
    try {
      const { cliente_id } = req.params;
      const enderecosResult = await db.select().from(enderecos).where(eq(enderecos.cliente_id, cliente_id));
      res.json(enderecosResult);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar endereços" });
    }
  });

  app.put("/api/enderecos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertEnderecoSchema.partial().parse(req.body);
      const endereco = await db.update(enderecos).set(data).where(eq(enderecos.id, id)).returning();
      res.json(endereco[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao atualizar endereço" });
    }
  });

  app.delete("/api/enderecos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await db.delete(enderecos).where(eq(enderecos.id, id)).returning();
      if (!deleted.length) {
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
      let clienteResult = await db.select().from(clientes).where(eq(clientes.telefone, cliente_telefone));
      let cliente;
      if (!clienteResult.length) {
        cliente = (await db.insert(clientes).values({
          nome: cliente_nome,
          telefone: cliente_telefone,
          email: cliente_email,
          endereco_padrao: `${endereco.rua}, ${endereco.numero}`,
        }).returning())[0];
      } else {
        cliente = clienteResult[0];
      }

      // Calcular total
      let total = 0;
      for (const item of itens) {
        total += item.preco_unitario * item.quantidade;
      }

      // Criar pedido
      const pedido = (await db.insert(pedidos).values({
        cliente_id: cliente.id,
        cliente_nome: cliente.nome,
        cliente_telefone: cliente.telefone,
        cliente_email: cliente.email,
        status: "pending",
        total: total.toString(),
        endereco_entrega: endereco,
        forma_pagamento,
        observacoes,
      }).returning())[0];

      // Criar itens do pedido
      for (const item of itens) {
        await db.insert(itens_pedido).values({
          pedido_id: pedido.id,
          produto_nome: item.produto_nome,
          categoria: item.categoria,
          tamanho: item.tamanho,
          sabores: item.sabores,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario.toString(),
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
      const pedido = await db.select().from(pedidos).where(eq(pedidos.id, id));
      if (!pedido.length) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      const itens = await db.select().from(itens_pedido).where(eq(itens_pedido.pedido_id, id));
      res.json({ ...pedido[0], itens });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pedido" });
    }
  });

  app.get("/api/pedidos/cliente/:cliente_id", async (req, res) => {
    try {
      const { cliente_id } = req.params;
      const pedidosResult = await db.select().from(pedidos).where(eq(pedidos.cliente_id, cliente_id));
      res.json(pedidosResult);
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

      const pedido = await db.update(pedidos).set({ status }).where(eq(pedidos.id, id)).returning();
      res.json(pedido[0]);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar status" });
    }
  });

  app.get("/api/admin/pedidos", async (req, res) => {
    try {
      const allPedidos = await db.select().from(pedidos);
      const pedidosComItens = await Promise.all(
        allPedidos.map(async (p) => ({
          ...p,
          itens: await db.select().from(itens_pedido).where(eq(itens_pedido.pedido_id, p.id)),
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
      const horarios = await db.select().from(horarios_funcionamento);
      res.json(horarios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar horários" });
    }
  });

  return httpServer;
}
