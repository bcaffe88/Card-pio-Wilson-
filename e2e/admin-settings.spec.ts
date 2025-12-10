import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Admin Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.locator('h2', { hasText: 'Configurações' })).toBeVisible();
  });

  test('should load and display existing restaurant settings', async ({ page }) => {
    // Aqui, podemos verificar se os campos estão preenchidos com valores padrão ou vazios, 
    // dependendo do estado inicial do banco de dados ou da lógica de mock.
    await expect(page.locator('label:has-text("Nome do Estabelecimento") + input')).toBeVisible();
    await expect(page.locator('label:has-text("Endereço Completo") + input')).toBeVisible();
    await expect(page.locator('label:has-text("Telefone para Pedidos (WhatsApp)") + input')).toBeVisible();
    
    // Verifica se a imagem da logo é exibida ou o placeholder de upload
    const logoImage = page.locator('.w-20.h-20 img');
    const uploadPlaceholder = page.locator('.w-20.h-20 span:has-text("Upload Logo")');

    await expect(logoImage.or(uploadPlaceholder)).toBeVisible();
  });

  test('should allow uploading a new logo and displaying its preview', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('Logo da Marca').setInputFiles([]); // Click for file chooser
    const fileChooser = await fileChooserPromise;
    
    const dummyImagePath = path.join(__dirname, '../attached_assets/stock_images/delicious_pepperoni__f6d6fa05.jpg');
    await fileChooser.setFiles(dummyImagePath);

    // Espera pelo upload e pela exibição da toast de sucesso
    await expect(page.getByText('Logo atualizada. Salve as alterações para aplicar.')).toBeVisible();
    
    // Verifica se a pré-visualização da imagem foi atualizada
    const logoPreview = page.locator('.w-20.h-20 img');
    await expect(logoPreview).toBeVisible();
    await expect(logoPreview).toHaveAttribute('src', /supabase\.co.*delicious_pepperoni__f6d6fa05\.jpg/); // Ajuste para o nome real do arquivo se diferente

    // Simula o clique no botão salvar. A persistência real depende do backend/DB.
    await page.getByRole('button', { name: 'Salvar Alterações' }).click();
    await expect(page.getByText('Configurações salvas')).toBeVisible();

    // Após salvar, uma recarga pode ser necessária para o frontend re-buscar os dados do DB
    await page.reload();
    const updatedLogo = page.locator('.w-20.h-20 img');
    await expect(updatedLogo).toBeVisible();
    await expect(updatedLogo).toHaveAttribute('src', /supabase\.co.*delicious_pepperoni__f6d6fa05\.jpg/);

  });

  test('should allow updating restaurant information and saving', async ({ page }) => {
    await page.locator('label:has-text("Nome do Estabelecimento") + input').fill('Minha Pizzaria Teste');
    await page.locator('label:has-text("Endereço Completo") + input').fill('Rua Teste, 123');
    await page.locator('label:has-text("Telefone para Pedidos (WhatsApp)") + input').fill('5511987654321');

    await page.getByRole('button', { name: 'Salvar Alterações' }).click();

    await expect(page.getByText('Configurações salvas')).toBeVisible();
    
    // Após salvar, uma recarga pode ser necessária para o frontend re-buscar os dados do DB
    await page.reload();

    await expect(page.locator('label:has-text("Nome do Estabelecimento") + input')).toHaveValue('Minha Pizzaria Teste');
    await expect(page.locator('label:has-text("Endereço Completo") + input')).toHaveValue('Rua Teste, 123');
    await expect(page.locator('label:has-text("Telefone para Pedidos (WhatsApp)") + input')).toHaveValue('5511987654321');
  });
});