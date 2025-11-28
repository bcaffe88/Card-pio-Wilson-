import { useState, useEffect } from "react";
import AdminLayout from "./layout";
import { useAdminStore, Order, OrderStatus } from "@/lib/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Package, 
  Send, 
  MessageCircle,
  XCircle,
  Bell
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const { orders, updateOrderStatus, markOrderAsViewed, getUnviewedOrdersCount } = useAdminStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [unviewedCount, setUnviewedCount] = useState(0);

  useEffect(() => {
    // Update unviewed count whenever orders change
    setUnviewedCount(getUnviewedOrdersCount());
  }, [orders, getUnviewedOrdersCount]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'production': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'ready': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'sent': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'delivered': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-secondary';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'production': return 'Em Produção';
      case 'ready': return 'Pronto';
      case 'sent': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
    }
  };

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    updateOrderStatus(id, newStatus);
    toast({
      title: "Status Atualizado",
      description: `Pedido ${id} alterado para ${getStatusLabel(newStatus)}`
    });
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'confirmed', 'production', 'ready', 'sent'].includes(order.status);
    if (activeTab === 'history') return ['delivered', 'cancelled'].includes(order.status);
    return order.status === activeTab;
  });

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className={`border-l-4 ${!order.viewed ? 'border-l-red-500 bg-red-500/5' : 'border-l-primary'}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {order.id}
              {!order.viewed && <Bell className="w-4 h-4 text-red-500 animate-pulse" />}
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              {order.customerName} • {order.customerPhone}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">R$ {order.total.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ptBR })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-sm border-b border-dashed border-border/50 last:border-0 py-1">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs font-medium text-muted-foreground bg-secondary/50 p-2 rounded">
          Pagamento: {order.paymentMethod}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0 pb-4 gap-2 overflow-x-auto">
        <Button variant="outline" size="sm" className="text-xs" onClick={() => window.open(`https://wa.me/${order.customerPhone}`, '_blank')}>
          <MessageCircle className="w-3 h-3 mr-1" /> WhatsApp
        </Button>
        
        <div className="flex gap-2">
          {order.status === 'pending' && (
            <>
              <Button size="sm" variant="destructive" onClick={() => handleStatusChange(order.id, 'cancelled')}>
                Rejeitar
              </Button>
              <Button size="sm" onClick={() => handleStatusChange(order.id, 'confirmed')}>
                Confirmar
              </Button>
            </>
          )}
          
          {order.status === 'confirmed' && (
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => handleStatusChange(order.id, 'production')}>
              <ChefHat className="w-4 h-4 mr-1" /> Produzir
            </Button>
          )}

          {order.status === 'production' && (
            <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleStatusChange(order.id, 'ready')}>
              <CheckCircle2 className="w-4 h-4 mr-1" /> Pronto
            </Button>
          )}

          {order.status === 'ready' && (
            <Button size="sm" className="bg-purple-500 hover:bg-purple-600" onClick={() => handleStatusChange(order.id, 'sent')}>
              <Send className="w-4 h-4 mr-1" /> Enviar
            </Button>
          )}
          
          {order.status === 'sent' && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.id, 'delivered')}>
              <Package className="w-4 h-4 mr-1" /> Entregue
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-heading font-bold">Fila de Pedidos</h2>
            <p className="text-muted-foreground">Gerencie o status dos pedidos em tempo real.</p>
          </div>
          {unviewedCount > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              <Bell className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="font-semibold text-red-500">{unviewedCount} novo{unviewedCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <Tabs defaultValue="active" className="w-full" onValueChange={(tab) => {
          setActiveTab(tab);
          // Mark visible orders as viewed when switching tabs
          filteredOrders.forEach(order => {
            if (!order.viewed) markOrderAsViewed(order.id);
          });
        }}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhum pedido encontrado nesta categoria.
              </div>
            ) : (
              filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
