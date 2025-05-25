export class ProductPage {
  constructor(private page) {}

  async addToCart(itemTestId: string) {
    await this.page.locator(`[data-test="${itemTestId}"]`).click();
  }

  async goToCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  async sort(option: 'az' | 'za' | 'lohi' | 'hilo') { // Added 'za' and 'lohi' for full sorting
    await this.page.locator('[data-test="product-sort-container"]').selectOption(option);
  }

  async getItemNames() {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices() {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }
}