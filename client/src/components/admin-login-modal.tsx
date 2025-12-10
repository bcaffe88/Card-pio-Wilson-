import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setAdminToken, hasAdminToken } from "@/lib/admin-auth";
import { Lock } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginModal({
  isOpen,
  onSuccess,
  onOpenChange,
}: AdminLoginModalProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!password.trim()) {
      toast({
        title: "Erro",
        description: "Digite a senha de administrador",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Testar autenticação fazendo uma requisição protegida
      const token = btoa(password);
      const response = await fetch("/api/configuracoes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.status === 401 || response.status === 403) {
        toast({
          title: "Erro",
          description: "Senha de administrador incorreta",
          variant: "destructive",
        });
        return;
      }

      // Se chegou aqui, senha está correta
      setAdminToken(password);
      toast({
        title: "Sucesso!",
        description: "Autenticação realizada",
      });
      setPassword("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Erro ao verificar autenticação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <DialogTitle>Acesso de Administrador</DialogTitle>
          </div>
          <DialogDescription>
            Digite sua senha de administrador para acessar as configurações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              placeholder="Digite sua senha"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleLogin}
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? "Verificando..." : "Entrar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
