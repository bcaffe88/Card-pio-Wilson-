import { useState, type ChangeEvent } from "react";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  prices: { [key: string]: number };
  image: string;
  active: boolean;
}

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: string[];
  onSave: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductEditModal({
  isOpen,
  onClose,
  product,
  categories,
  onSave,
  onDelete
}: ProductEditModalProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Product>(() => 
    product || {
      id: '',
      name: '',
      description: '',
      category: '',
      prices: { P: 0, M: 0, G: 0, Super: 0 },
      image: '',
      active: true
    }
  );

  // Update formData when product prop changes
  React.useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: body,
      });

      if (!response.ok) {
        throw new Error("Falha no upload da imagem do produto.");
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      
      toast({
        title: "Sucesso!",
        description: "Imagem do produto atualizada. Salve para aplicar.",
        variant: "success"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro de Upload",
        description: "Não foi possível enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    // API call will be: POST /api/products/{id}
    // WITH body: { name, description, category, prices, image, active }
    console.log('Sending to API: POST /api/products/:id', formData);
    
    onSave(formData);
    toast({
      title: "Produto atualizado",
      description: "As alterações serão sincronizadas com o servidor."
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Deseja realmente deletar "${formData.name}"?`)) {
      // API call will be: DELETE /api/products/{id}
      console.log('Sending to API: DELETE /api/products/:id', formData.id);
      
      onDelete(formData.id);
      toast({
        title: "Produto deletado",
        description: "O produto foi removido do cardápio.",
        variant: "destructive"
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Atualize os detalhes do produto. As mudanças serão sincronizadas com o banco de dados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Imagem */}
          <div className="space-y-2">
            <Label>Imagem do Produto</Label>
            <Card className="border-dashed cursor-pointer hover:bg-muted/50">
              <CardContent className="p-4">
                <div className="w-full h-40 rounded-lg bg-muted flex items-center justify-center overflow-hidden mb-3">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : formData.image ? (
                    <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="text-xs"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Recomendado: 500x500px. Será enviado para Supabase Storage.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Nome e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Produto</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Pizza Calabresa"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva os detalhes do produto..."
              rows={3}
            />
          </div>

          {/* Preços */}
          <div className="space-y-2">
            <Label>Preços por Tamanho</Label>
            <div className="grid grid-cols-4 gap-3">
              {['P', 'M', 'G', 'Super'].map(size => (
                <div key={size} className="space-y-1">
                  <Label className="text-xs">{size}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.prices[size] || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      prices: { ...formData.prices, [size]: parseFloat(e.target.value) }
                    })}
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Status Ativo/Inativo */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="space-y-1">
              <Label className="font-medium">Produto Ativo</Label>
              <p className="text-xs text-muted-foreground">
                {formData.active ? "Visível no cardápio" : "Oculto do cardápio"}
              </p>
            </div>
            <Switch
              checked={formData.active}
              onCheckedChange={(val) => setFormData({ ...formData, active: val })}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Deletar Produto
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
