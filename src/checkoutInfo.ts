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

    async accessToCheckoutInfoPage() { //no se usa return porque su propósito es ejecutar una acción (hacer clic en un botón), no devolver un valor.
        await this.checkoutButton.waitFor({ state: 'visible' }); //Agregar una espera implícita para asegurarse de que el botón está disponible antes de hacer clic
        await this.checkoutButton.click(); //Como el click() ya es una promesa (Promise<void>), no hay un valor útil que devolver.
        await this.continueButton.waitFor({ state: 'visible' }); //Aseguramos que el botón "Continue" sea visible
    }

    async checkoutCorrectInfo(name: string, lastName: string, postalCode: string) { //No tiene public explícito porque en TypeScript, los métodos son public por defecto si no se define private o protected
        await this.firstName.clear(); //Para asegurarte de que los campos están vacíos en primera instancia antes de llenarlos.
        await this.lastName.clear();
        await this.postalCode.clear();
        
        await this.firstName.fill(name);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
        await this.continueButton.click();

    }

    public getContinueButton(): Locator { //Se puede dejar sin el locator, sin embargo como buena práctica de TypeScript es mejor dejarlo declarado. 
        return this.continueButton; //Se usa return porque su propósito es devolver el Locator correspondiente al botón "Continue" para que pueda ser utilizado en el test.
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

    async getErrorMsgMandatoryAllFields(): Promise<string> { //El async Tiene public por defecto porque queremos llamarlo desde los tests.
        return this.errorMessageFields.innerText(); //innerText() obtiene el mensaje de error con más precisión. Muestra el texto texto tal como se ve en la UI. return: Devuelve el valor obtenido con .innerText(), que es un string, es decir el msg de error. es una promesa (Promise<string>).
       //return this.errorMessageFields; //Esto es otra manera de hacerlo por el locator para llamar en el test ToHaveText() y en el método cambiarle el async por public. Siempre que puedas, usa aserciones de Locator, como toHaveText() o toBeVisible(), en lugar de extraer texto con innerText(). Son más eficientes
    }

}