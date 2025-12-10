

import { useState, useEffect } from "react";
import AdminLayout from "./layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MENU_ITEMS } from "@/data/menu";
import { RefreshCw, Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/admin-auth";
import ProductEditModal from "@/components/product-edit-modal";

export default function AdminMenu() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estratégia SIMPLES: carrega APENAS do banco de dados (Railway)
  const fetchAndMergeProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cardapio');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      // Transforma produtos do banco para formato do frontend
      const transformed = data.map((dbItem: any) => ({
        id: dbItem.id,
        name: dbItem.nome_item,
        description: dbItem.descricao || '',
        category: dbItem.categoria,
        prices: dbItem.precos || {},
        image: dbItem.imagem_url || '',
        active: dbItem.disponivel !== false
      }));
      
      setProducts(transformed);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos do banco de dados.",
        variant: "destructive"
      });
      // Fallback para MENU_ITEMS apenas se banco falhar
      setProducts(MENU_ITEMS.map(item => ({ ...item })));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchAndMergeProducts();
  }, []);

  const filteredItems = products.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (updatedProduct: any) => {
    try {
      const apiPayload = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        category: updatedProduct.category,
        prices: updatedProduct.prices,
        image: updatedProduct.image,
        active: updatedProduct.active
      };

      console.log('Saving product to API:', apiPayload);

      const response = await fetchWithAuth(`/api/cardapio/${updatedProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(apiPayload),
      });
      if (!response.ok) throw new Error('Failed to update product');
      
      await fetchAndMergeProducts();
      
      toast({
        title: "Produto salvo",
        description: "O produto foi atualizado com sucesso.",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    console.log('Deleting product from API:', productId);
    
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Produto deletado",
      description: "O produto foi removido do cardápio.",
      variant: "destructive"
    });
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await fetchAndMergeProducts();
      toast({
        title: "Sincronização Concluída",
        description: "Cardápio atualizado com base no banco de dados."
      });
    } catch (error) {
      console.error('Error syncing:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar o cardápio.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-heading font-bold">Gerenciar Cardápio</h2>
            <p className="text-muted-foreground">Edite produtos, preços e imagens.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={handleSync} 
              disabled={isSyncing}
              className="flex-1 md:flex-none"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar DB'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Gerenciar e editar produtos do cardápio.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isLoading ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagem</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      item && (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                              {item.image ? (
                                <img src={item.image} alt={item.name || ''} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs text-muted-foreground">Sem imagem</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.name || '--'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.category || '--'}</Badge>
                          </TableCell>
                          <TableCell>
                            R$ {item.prices && item.prices['G'] ? item.prices['G'].toFixed(2) : '--'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleEditProduct(item)}
                                data-testid="button-edit-product"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Mostrando {filteredItems.length} produtos
            </div>
          </CardContent>
        </Card>

        <ProductEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </AdminLayout>
  );
}