export class CartPage {
  constructor(private page) {}

  async removeItem(itemTestId: string) {
    await this.page.locator(`[data-test="${itemTestId}"]`).click();
  }

  async getCartItemsCount() {
    return await this.page.locator('.cart_item').count();
  }

  async clickCheckout() {
    await this.page.locator('[data-test="checkout"]').click();
  }

  async continueShopping() {
    await this.page.locator('[data-test="continue-shopping"]').click();
  }
}