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

    async loginCorrectCredentials(username: string, password: string){ 
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    public getErrorMessage(): Locator { 
             return this.loginErrorMessage; 
     }

    public getProductTitle(): Locator {
        return this.productTitle;
    }



}