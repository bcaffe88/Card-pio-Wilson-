import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminStore } from "@/lib/admin-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAdminStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "admin" && password === "#123caffe@") {
      login();
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo.",
      });
      setLocation("/admin/orders");
    } else {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Usuário ou senha incorretos.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-heading">Acesso Restrito</CardTitle>
          <CardDescription>
            Painel Administrativo Wilson Pizza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input 
                id="username" 
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full font-bold">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
