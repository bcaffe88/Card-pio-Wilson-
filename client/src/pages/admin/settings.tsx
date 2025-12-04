import { useState, type ChangeEvent } from "react";
import AdminLayout from "./layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAdminStore } from "@/lib/admin-store";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Database, Webhook, Clock, Loader2 } from "lucide-react";

export default function AdminSettings() {
  const store = useAdminStore();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
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

  // Mock Operating Hours State
  const [hours, setHours] = useState([
    { day: 'Segunda', open: '10:00', close: '23:00', active: true },
    { day: 'Terça', open: '10:00', close: '23:00', active: true },
    { day: 'Quarta', open: '10:00', close: '23:00', active: true },
    { day: 'Quinta', open: '10:00', close: '23:00', active: true },
    { day: 'Sexta', open: '10:00', close: '00:00', active: true },
    { day: 'Sábado', open: '10:00', close: '00:00', active: true },
    { day: 'Domingo', open: '10:00', close: '00:00', active: true },
  ]);

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha no upload");
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, restaurantLogo: data.publicUrl }));
      
      toast({
        title: "Sucesso!",
        description: "Logo atualizada. Salve as alterações para aplicar.",
        variant: "success"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : formData.restaurantLogo ? (
                    <img src={formData.restaurantLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground text-center p-2">Upload Logo</span>
                  )}
                </div>
                <div className="flex-1">
                  <Label>Logo da Marca</Label>
                  <p className="text-xs text-muted-foreground mb-2">Recomendado: 500x500px PNG ou JPG</p>
                  <Input 
                    type="file" 
                    className="text-xs" 
                    onChange={handleLogoUpload} 
                    disabled={isUploading}
                  />
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

          {/* Horários de Funcionamento */}
          <Card>
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <Clock className="w-5 h-5" />
                </div>
                Horários de Funcionamento
              </CardTitle>
              <CardDescription>Defina os horários para o agente validar automaticamente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hours.map((slot, idx) => (
                  <div key={slot.day} className="flex items-center gap-4">
                    <div className="w-24 font-medium">{slot.day}</div>
                    <Input 
                      type="time" 
                      value={slot.open} 
                      className="w-32" 
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[idx].open = e.target.value;
                        setHours(newHours);
                      }}
                    />
                    <span>às</span>
                    <Input 
                      type="time" 
                      value={slot.close} 
                      className="w-32"
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[idx].close = e.target.value;
                        setHours(newHours);
                      }}
                    />
                    <Switch 
                      checked={slot.active}
                      onCheckedChange={(c) => {
                        const newHours = [...hours];
                        newHours[idx].active = c;
                        setHours(newHours);
                      }}
                    />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" onClick={() => toast({ title: "Horários Sincronizados", description: "Tabela 'horarios_funcionamento' atualizada." })}>
                  Sincronizar Horários com Supabase
                </Button>
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
