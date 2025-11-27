import { useState } from "react";
import AdminLayout from "./layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAdminStore } from "@/lib/admin-store";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Database, Webhook } from "lucide-react";

export default function AdminSettings() {
  const store = useAdminStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    restaurantName: store.restaurantName,
    restaurantAddress: store.restaurantAddress,
    restaurantPhone: store.restaurantPhone,
    restaurantLogo: store.restaurantLogo,
    supabaseUrl: store.supabaseUrl,
    supabaseKey: store.supabaseKey,
    webhookUrl: store.webhookUrl,
    whatsappNotification: store.whatsappNotification
  });

  const handleSave = () => {
    store.updateSettings(formData);
    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso."
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-heading font-bold">Configurações</h2>
          <p className="text-muted-foreground">Gerencie as informações da pizzaria e integrações.</p>
        </div>

        <div className="grid gap-6">
          {/* Informações do Restaurante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Upload className="w-5 h-5" />
                </div>
                Identidade do Restaurante
              </CardTitle>
              <CardDescription>Logo, nome, endereço e telefone de pedidos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group cursor-pointer hover:bg-muted/80 transition-colors">
                  {formData.restaurantLogo ? (
                    <img src={formData.restaurantLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground text-center p-2">Upload Logo</span>
                  )}
                </div>
                <div className="flex-1">
                  <Label>Logo da Marca</Label>
                  <p className="text-xs text-muted-foreground mb-2">Recomendado: 500x500px PNG ou JPG</p>
                  <Input type="file" className="text-xs" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Estabelecimento</Label>
                  <Input 
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone para Pedidos (WhatsApp)</Label>
                  <Input 
                    value={formData.restaurantPhone}
                    placeholder="5587999999999"
                    onChange={(e) => setFormData({...formData, restaurantPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Endereço Completo</Label>
                <Input 
                  value={formData.restaurantAddress}
                  onChange={(e) => setFormData({...formData, restaurantAddress: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Integrações Supabase */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Database className="w-5 h-5" />
                </div>
                Banco de Dados (Supabase)
              </CardTitle>
              <CardDescription>Configuração para sincronização com tabela 'cardapio'.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Supabase Project URL</Label>
                <Input 
                  value={formData.supabaseUrl}
                  placeholder="https://xxxxxxxxxxxx.supabase.co"
                  onChange={(e) => setFormData({...formData, supabaseUrl: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Supabase Anon Key</Label>
                <Input 
                  type="password"
                  value={formData.supabaseKey}
                  placeholder="eyJh..."
                  onChange={(e) => setFormData({...formData, supabaseKey: e.target.value})}
                />
              </div>
              <Button variant="outline" className="w-full">
                Testar Conexão e Sincronizar
              </Button>
            </CardContent>
          </Card>

          {/* Webhook & Automação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                  <Webhook className="w-5 h-5" />
                </div>
                Automação e Webhooks
              </CardTitle>
              <CardDescription>Integração com n8n/IA e notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Webhook URL (Recebimento de Pedidos IA)</Label>
                <Input 
                  value={formData.webhookUrl}
                  placeholder="https://n8n.seu-dominio.com/webhook/..."
                  onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  URL que será chamada quando o agente IA processar um pedido.
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações WhatsApp</Label>
                  <p className="text-xs text-muted-foreground">
                    Enviar mensagem automática ao cliente quando o status do pedido mudar.
                  </p>
                </div>
                <Switch 
                  checked={formData.whatsappNotification}
                  onCheckedChange={(c) => setFormData({...formData, whatsappNotification: c})}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end sticky bottom-4 z-10">
          <Button onClick={handleSave} size="lg" className="shadow-xl font-bold">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
