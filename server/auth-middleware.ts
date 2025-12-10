import { Request, Response, NextFunction } from "express";

// TODO: Implementar autenticação real com banco de dados
// Por enquanto, usar variável de ambiente para senha de admin

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
      adminToken?: string;
    }
  }
}

/**
 * Middleware para validar token de admin
 * Espera: Authorization: Bearer <token>
 * Token é a senha do admin codificada em base64
 */
export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Admin authorization required",
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    
    // TODO: Implementar verificação com banco de dados
    // Por enquanto, fazer verificação simples
    if (token !== Buffer.from(ADMIN_PASSWORD).toString("base64")) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Invalid admin token",
      });
    }

    req.isAdmin = true;
    req.adminToken = token;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Authentication error",
      message: "Failed to process authorization",
    });
  }
};

/**
 * Middleware para verificar autenticação optional
 * Se token válido está presente, marca como admin
 */
export const optionalAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      
      if (token === Buffer.from(ADMIN_PASSWORD).toString("base64")) {
        req.isAdmin = true;
        req.adminToken = token;
      }
    }
    
    next();
  } catch (error) {
    // Continuar sem autenticação se houver erro
    next();
  }
};
