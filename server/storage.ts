import { createClient } from "@supabase/supabase-js";
import { log } from "./index";

// As variáveis de ambiente devem ser configuradas no seu provedor de hospedagem (Railway)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log("Supabase URL (from env):", supabaseUrl);
console.log("Supabase Key (from env):", supabaseKey ? "[REDACTED]" : "[MISSING]");

if (!supabaseUrl || !supabaseKey) {
  log("Missing Supabase environment variables for storage", "error");
  // Em um ambiente de produção, você pode querer lançar um erro.
  // throw new Error("Missing Supabase environment variables for storage");
}

// Criamos um cliente Supabase, mas apenas se as chaves existirem.
// Isso evita que o app quebre no boot se as chaves não estiverem lá,
// mas as tentativas de upload falharão.
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Faz upload de um arquivo para o Supabase Storage.
 * @param bucketName O nome do bucket (ex: "imagens-cardapio").
 * @param fileName O nome do arquivo a ser salvo.
 * @param fileBuffer O conteúdo do arquivo.
 * @param contentType O tipo do arquivo (ex: "image/png").
 * @returns A URL pública do arquivo upado.
 */
export async function uploadFileToSupabase(
  bucketName: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string,
): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client not initialized. Check environment variables.");
  }

  const uniqueFileName = `${Date.now()}-${fileName.replace(/\s/g, "_")}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(uniqueFileName, fileBuffer, {
      contentType: contentType,
      upsert: false, // Não sobrescrever arquivos com o mesmo nome
    });

  if (error) {
    log(`Supabase upload error: ${error.message}`, "storage");
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  if (!publicUrlData) {
    throw new Error("Could not get public URL for the uploaded file.");
  }
  
  log(`File uploaded successfully: ${publicUrlData.publicUrl}`, "storage");
  return publicUrlData.publicUrl;
}