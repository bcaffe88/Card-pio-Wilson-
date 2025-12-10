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
import ProductEditModal from "@/components/product-edit-modal";

export default function AdminMenu() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]); // Initialize products as an empty array
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from database on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cardapio');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      
      // Transform database format to component format
      const transformedProducts = data.map((item: any) => ({
        id: item.id,
        name: item.nome_item,
        description: item.descricao || '',
        category: item.categoria,
        prices: item.precos || {},
        image: item.imagem_url || '',
        active: item.disponivel !== false
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos do banco de dados.",
        variant: "destructive"
      });
      // Não faz fallback para MENU_ITEMS, apenas mostra erro
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos do banco de dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      // Map component format back to API format
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
      
      const response = await fetch(`/api/cardapio/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      const savedProduct = await response.json();

      // Update local state with the response from server (includes cache-busting)
      const transformedProduct = {
        id: savedProduct.id,
        name: savedProduct.nome_item,
        description: savedProduct.descricao || '',
        category: savedProduct.categoria,
        prices: savedProduct.precos || {},
        image: savedProduct.imagem_url || '',
        active: savedProduct.disponivel !== false
      };

      setProducts(products.map(p => 
        p.id === updatedProduct.id ? transformedProduct : p
      ));

      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso."
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações do produto.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    // API call will be: DELETE /api/products/{id}
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
      await fetchProducts();
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
            <Button className="flex-1 md:flex-none">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Produtos Cadastrados</CardTitle>
              <Input 
                placeholder="Buscar produto..." 
                className="max-w-xs" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum produto cadastrado.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Imagem</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço Base (G)</TableHead>
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
              )}
            </div>
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
