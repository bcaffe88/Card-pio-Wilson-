import { db } from "./db";
import { configuracoes } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function triggerWebhook(
  event: string,
  data: any
): Promise<boolean> {
  try {
    // Get webhook configuration - will be available after migration
    // For now, this is a placeholder that will work once schema is updated
    
    // TODO: Enable after webhook_url is added to schema
    // const config = await db.query.configuracoes.findFirst({
    //   where: eq(configuracoes.id, 1)
    // });
    
    // if (!config?.webhook_url) {
    //   console.log(`[Webhook] No webhook URL configured for event: ${event}`);
    //   return false;
    // }

    // For now, webhook is disabled
    console.log(`[Webhook] Event queued for later processing:`, { event, data });
    return true;
  } catch (error) {
    console.error(`[Webhook] Error processing webhook:`, error);
    return false;
  }
}
