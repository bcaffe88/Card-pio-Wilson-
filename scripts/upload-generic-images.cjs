// Script para upload automático de imagens genéricas no Supabase Storage
// Uso: node scripts/upload-generic-images.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://ktbzjpwvzcrzzoacfciv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0YnpqcHd2emNyenpvYWNmY2l2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc1MTAwMCwiZXhwIjoyMDc5MzI3MDAwfQ.Ok8txGFlDPKoAAHjZd0_uxsKkop5p0cWW_zJyaKkRns';
const bucket = 'imagens-cardapio';

const images = [
  { name: 'pizza.jpg', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
  { name: 'pizza-doce.jpg', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { name: 'massa.jpg', url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a?auto=format&fit=crop&w=600&q=80' },
  { name: 'pastel.jpg', url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80' },
  { name: 'lasanha.jpg', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { name: 'calzone.jpg', url: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80' },
  { name: 'petisco.jpg', url: 'https://images.unsplash.com/photo-1464306076886-debede6bbf09?auto=format&fit=crop&w=600&q=80' },
  { name: 'bebida.jpg', url: 'https://images.unsplash.com/photo-1514361892635-cebbd6b8aee7?auto=format&fit=crop&w=600&q=80' },
  { name: 'default.jpg', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' }
];

const downloadImage = async (url, filename) => {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(buffer));
};

const uploadImages = async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  for (const img of images) {
    const localPath = path.join(__dirname, img.name);
    console.log(`Baixando ${img.name}...`);
    await downloadImage(img.url, localPath);
    const fileBuffer = fs.readFileSync(localPath);
    console.log(`Enviando ${img.name} para Supabase...`);
    const { error } = await supabase.storage.from(bucket).upload(img.name, fileBuffer, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/jpeg',
    });
    if (error) {
      console.error(`Erro ao enviar ${img.name}:`, error.message);
    } else {
      console.log(`✅ ${img.name} enviada com sucesso!`);
    }
    fs.unlinkSync(localPath);
  }
  console.log('Todas as imagens genéricas foram enviadas!');
};

uploadImages();
