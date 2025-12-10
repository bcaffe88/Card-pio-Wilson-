// WhatsApp Notification Service
// 
// NOTA: Atualmente usando wa.me (link direto) no frontend
// Integração com API real pode ser adicionada aqui depois
// 
// Opções futuras para integração de API:
// 1. Twilio: https://www.twilio.com/whatsapp
// 2. Evolution API: https://evolution-api.com/
// 3. WhatsApp Business API (oficial)

export async function sendWhatsAppNotification(
  telefone: string,
  message: string
): Promise<boolean> {
  try {
    const normalizedPhone = telefone.replace(/\D/g, '');
    
    // Validar formato do telefone (Brasil: 55 + DDD + número)
    if (!normalizedPhone.match(/^55\d{10,11}$/)) {
      console.error(`[WhatsApp] Invalid phone format: ${telefone}`);
      return false;
    }

    console.log(`[WhatsApp] Message link: https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`);
    console.log(`[WhatsApp] Content: ${message.substring(0, 50)}...`);
    
    // Versão atual: Frontend usa wa.me para abrir app ou web
    // Próxima versão: Integrar com Twilio ou Evolution API aqui
    
    return true;
  } catch (error) {
    console.error(`[WhatsApp] Error:`, error);
    return false;
  }
}
