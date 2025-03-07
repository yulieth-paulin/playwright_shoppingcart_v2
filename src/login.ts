import { Locator, Page } from "@playwright/test";

export class LoginPage{
    private readonly userNameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginErrorMessage: Locator;
    private readonly productTitle: Locator;

    constructor(page: Page){
        this.userNameInput = page.locator("//input[@id='user-name']");
        this.passwordInput = page.getByRole('textbox', {name: 'Password'});
        this.loginButton = page.getByRole('button', {name: 'Login'});
        this.loginErrorMessage = page.locator("//div[@class='error-message-container error']");
        this.productTitle = page.locator("//span[@data-test='title']");

    }

    async loginCorrectCredentials(username: string, password: string){ //Aqui vamos a gestionar operaciones asincrónicas
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage(): Promise<string> { //operación asincrónica que devuelve una Promise<string>
        return await this.loginErrorMessage.innerText(); //innerText() es asíncrono porque debe esperar a que Playwright obtenga el texto del DOM. await espera el resultado antes de devolverlo.
    }

    public getProductTitle(): Locator {
        return this.productTitle;
    }



}