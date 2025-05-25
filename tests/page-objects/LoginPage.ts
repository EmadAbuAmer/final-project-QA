import 'dotenv/config';

export class LoginPage {
  constructor(private page) {}

  async goto() {
    await this.page.goto(process.env.BASEURL!);
  }

  async login(username: string, password: string) {
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.click('#login-button');
  }
}