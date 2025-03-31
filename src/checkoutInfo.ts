import { Locator, Page } from "@playwright/test";

export class CheckoutInformation {
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly postalCode: Locator;
    private readonly checkoutButton: Locator;
    private readonly continueButton: Locator;
    private readonly errorMessageFields: Locator;
   

    constructor(page: Page){
        this.firstName = page.getByRole('textbox', {name: 'First Name'});
        this.lastName = page.locator("//input[@id='last-name']")
        this.postalCode = page.getByRole('textbox', {name: 'Zip/Postal Code'});
        this.checkoutButton = page.locator("//button[@id='checkout']");
        this.continueButton = page.locator("//input[@id='continue']");
        this.errorMessageFields = page.locator("//div[@class='error-message-container error']");

    }

    async accessToCheckoutInfoPage(): Promise<void> { 
        await this.checkoutButton.click(); 

    }

    async checkoutCorrectInfo(name: string, lastName: string, postalCode: string) { 
        await this.firstName.clear(); 
        await this.lastName.clear();
        await this.postalCode.clear();
        
        await this.firstName.fill(name);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
        await this.continueButton.click();

    }

    public getContinueButton(): Locator { 
        return this.continueButton; 
    }

    public getPlaceHolderFisrtName(): Locator{
        return this.firstName;
    }

    public getPlaceHolderLastName(): Locator{
        return this.lastName;
    }

    public getPlaceHolderPostalCode(): Locator{
        return this.postalCode;
    }

    public getErrorMsgMandatoryAllFields(): Locator { 
        return this.errorMessageFields; 
    }

}