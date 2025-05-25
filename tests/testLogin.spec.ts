import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import 'dotenv/config';

test.describe('Login Feature Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should allow a standard user to log in successfully', async ({ page }) => {
        await loginPage.login(process.env.USER_NAME!, process.env.PASSWORD!);
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(page.locator('.app_logo')).toBeVisible();
    });

    test('should display an error message for invalid credentials', async ({ page }) => {
        await loginPage.login('invalid_user', 'wrong_password');
        const errorMessage = await page.locator('[data-test="error"]').textContent();
        await expect(errorMessage).toContain('Username and password do not match any user in this service');
        await expect(page).toHaveURL(process.env.BASEURL!);
    });

    test('should display an error message for locked out user', async ({ page }) => {
        await loginPage.login('locked_out_user', process.env.PASSWORD!);
        const errorMessage = await page.locator('[data-test="error"]').textContent();
        await expect(errorMessage).toContain('Sorry, this user has been locked out.');
        await expect(page).toHaveURL(process.env.BASEURL!);
    });
});