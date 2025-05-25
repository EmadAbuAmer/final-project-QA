export class CheckoutPage {
  constructor(private page) {}

  async fillCheckoutInfo(first: string, last: string, postal: string) {
    await this.page.locator('[data-test="firstName"]').fill(first);
    await this.page.locator('[data-test="lastName"]').fill(last);
    await this.page.locator('[data-test="postalCode"]').fill(postal);
    await this.page.locator('[data-test="continue"]').click();
  }

  async finish() {
    await this.page.locator('[data-test="finish"]').click();
  }

  async isSuccessMessageVisible() {
    return await this.page.locator('.complete-header').textContent();
  }
}