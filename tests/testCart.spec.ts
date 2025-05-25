import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { ProductPage } from './page-objects/ProductPage';
import { CartPage } from './page-objects/CartPage';
import 'dotenv/config';

test.describe('Cart Features', () => {
    let loginPage: LoginPage;
    let productPage: ProductPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);

        await loginPage.goto();
        await loginPage.login(process.env.USER_NAME!, process.env.PASSWORD!);
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('add multiple items to cart', async ({ page }) => {
        await productPage.addToCart('add-to-cart-sauce-labs-bike-light');
        await productPage.addToCart('add-to-cart-sauce-labs-backpack');
        await productPage.goToCart();
        await expect(await cartPage.getCartItemsCount()).toBe(2);
    });

    test('remove all items', async ({ page }) => {
        await productPage.addToCart('add-to-cart-sauce-labs-bike-light');
        await productPage.addToCart('add-to-cart-sauce-labs-backpack');
        await productPage.goToCart();
        await cartPage.removeItem('remove-sauce-labs-bike-light');
        await cartPage.removeItem('remove-sauce-labs-backpack');
        await expect(await cartPage.getCartItemsCount()).toBe(0);
    });

    test('continue shopping from cart', async ({ page }) => {
        await productPage.addToCart('add-to-cart-sauce-labs-bike-light');
        await productPage.goToCart();
        await cartPage.continueShopping();
        await expect(page).toHaveURL(/.*inventory.html/); 
    });
});