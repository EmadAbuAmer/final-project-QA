import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { ProductPage } from './page-objects/ProductPage';
import { CartPage } from './page-objects/CartPage';
import { CheckoutPage } from './page-objects/CheckoutPage';
import 'dotenv/config';

test.describe('Checkout Features', () => {
    let loginPage: LoginPage;
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.goto();
        await loginPage.login(process.env.USER_NAME!, process.env.PASSWORD!);
        await expect(page).toHaveURL(/.*inventory.html/); 
        await productPage.addToCart('add-to-cart-sauce-labs-backpack');
        await productPage.goToCart();
        await expect(page).toHaveURL(/.*cart.html/);
    });

    test('complete a successful checkout', async ({ page }) => {
        await cartPage.clickCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one.html/);

        await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
        await expect(page).toHaveURL(/.*checkout-step-two.html/);

        await checkoutPage.finish();
        await expect(page).toHaveURL(/.*checkout-complete.html/);

        await expect(await checkoutPage.isSuccessMessageVisible()).toContain('Thank you for your order!');
    });

    test('should show error for missing first name in checkout', async ({ page }) => {
        await cartPage.clickCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one.html/);
        await page.locator('[data-test="lastName"]').fill('Doe');
        await page.locator('[data-test="postalCode"]').fill('12345');
        await page.locator('[data-test="continue"]').click();

        const errorMessage = await page.locator('[data-test="error"]').textContent();
        await expect(errorMessage).toContain('Error: First Name is required');
        await expect(page).toHaveURL(/.*checkout-step-one.html/);
    });

    test('should cancel checkout and return to cart', async ({ page }) => {
        await cartPage.clickCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one.html/);

        await page.locator('[data-test="cancel"]').click(); 
        await expect(page).toHaveURL(/.*cart.html/);
        await expect(await cartPage.getCartItemsCount()).toBe(1); 
    });
});