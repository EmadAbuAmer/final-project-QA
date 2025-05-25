import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { ProductPage } from './page-objects/ProductPage';
import 'dotenv/config';

test.describe('Sort Features', () => {
    let loginPage: LoginPage;
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);

        await loginPage.goto();
        await loginPage.login(process.env.USER_NAME!, process.env.PASSWORD!);
        await expect(page).toHaveURL(/.*inventory.html/); 
    });

    test('should sort items by Name (A to Z)', async ({ page }) => {
        await productPage.sort('az');
        const itemNames = await productPage.getItemNames();
        const sortedItemNames = [...itemNames].sort((a, b) => a.localeCompare(b));
        expect(itemNames).toEqual(sortedItemNames);
    });

    test('should sort items by Name (Z to A)', async ({ page }) => {
        await productPage.sort('za');
        const itemNames = await productPage.getItemNames();
        const sortedItemNames = [...itemNames].sort((a, b) => b.localeCompare(a));
        expect(itemNames).toEqual(sortedItemNames);
    });

    test('should sort items by Price (Low to High)', async ({ page }) => {
        await productPage.sort('lohi');
        const itemPrices = await productPage.getItemPrices();
        const sortedItemPrices = [...itemPrices].sort((a, b) => a - b);
        expect(itemPrices).toEqual(sortedItemPrices);
    });

    test('should sort items by Price (High to Low)', async ({ page }) => {
        await productPage.sort('hilo');
        const itemPrices = await productPage.getItemPrices();
        const sortedItemPrices = [...itemPrices].sort((a, b) => b - a);
        expect(itemPrices).toEqual(sortedItemPrices);
    });
});