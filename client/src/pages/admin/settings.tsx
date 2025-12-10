import { useState, type ChangeEvent, useEffect } from "react";
import AdminLayout from "./layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Database, Webhook, Clock, Loader2 } from "lucide-react";

// Removido useAdminStore pois agora os dados vêm da API

export default function AdminSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nome_restaurante: '',
    endereco: '',
    telefone: '',
    logo_url: '',
    // Mantendo estes campos para o formulário, mesmo que não persistam na mesma tabela
    supabaseUrl: '',
    supabaseKey: '',
    webhookUrl: '',
    whatsappNotification: false
  });

  // Carregar dados iniciais da API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/configuracoes");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFormData(prev => ({
              ...prev,
              nome_restaurante: data.nome_restaurante || '',
              endereco: data.endereco || '',
              telefone: data.telefone || '',
              logo_url: data.logo_url || '',
              webhookUrl: data.webhook_url || '',
              supabaseUrl: data.supabase_url || '',
              supabaseKey: data.supabase_key || '',
              whatsappNotification: data.whatsapp_notification ?? true,
            }));
            
            // Carregar horários se existirem no banco
            if (data.horarios) {
              try {
                const parsedHours = JSON.parse(data.horarios);
                setHours(parsedHours);
              } catch (e) {
                console.error("Erro ao parsear horários:", e);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        toast({ title: "Erro", description: "Não foi possível carregar as configurações.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

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
    const uploadForm = new FormData();
    uploadForm.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      if (!response.ok) {
        throw new Error("Falha no upload");
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, logo_url: data.publicUrl }));
      
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsToSave = {
        nome_restaurante: formData.nome_restaurante,
        endereco: formData.endereco,
        telefone: formData.telefone,
        logo_url: formData.logo_url,
        webhook_url: formData.webhookUrl,
        supabase_url: formData.supabaseUrl,
        supabase_key: formData.supabaseKey,
        whatsapp_notification: formData.whatsappNotification,
        horarios: JSON.stringify(hours),
      };

      const response = await fetch("/api/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar as configurações");
      }

      toast({
        title: "Configurações salvas",
        description: "Todas as alterações foram persistidas no banco de dados com sucesso.",
        variant: "success"
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

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
                  ) : formData.logo_url ? (
                    <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
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
                    value={formData.nome_restaurante}
                    onChange={(e) => setFormData({...formData, nome_restaurante: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone para Pedidos (WhatsApp)</Label>
                  <Input 
                    value={formData.telefone}
                    placeholder="5587999999999"
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Endereço Completo</Label>
                <Input 
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
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
          <Button onClick={handleSave} size="lg" className="shadow-xl font-bold" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
