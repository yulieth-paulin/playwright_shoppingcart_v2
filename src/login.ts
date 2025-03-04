import { Locator, Page } from "@playwright/test";

export class LoginPage{
    private readonly page: Page;
    private readonly userNameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginErrorMessage: Locator;

    constructor(page: Page){
        this.page = page;
        this.userNameInput = page.locator("//input[@id='user-name']");
        this.passwordInput = page.getByRole('textbox', {name: 'Password'});
        this.loginButton = page.getByRole('button', {name: 'Login'});
        this.loginErrorMessage = page.locator("//div[@class='error-message-container error']");

    }

    async loginCorrectCredentials(username: string, password: string){
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage(): Promise<string> { //operación asincrónica que devuelve una Promise<string>
        return await this.loginErrorMessage.innerText(); //innerText() es asíncrono porque debe esperar a que Playwright obtenga el texto del DOM. await espera el resultado antes de devolverlo.
    }

}