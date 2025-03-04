import { Locator, Page } from "@playwright/test";

export class CheckoutCompletePage {
    private readonly shoppingCartBadge: Locator; 
    private readonly checkoutCompletetitle: Locator;
    private readonly checkoutGreenImage: Locator;
    private readonly orderMessage: Locator;
    private readonly orderDispatchedMessage: Locator;
    private readonly backHomeButton: Locator;


    constructor (page: Page) {
        this.shoppingCartBadge = page.locator("//span[@class='shopping_cart_badge']");
        this.checkoutCompletetitle = page.locator("//span[@data-test='title']");
        this.checkoutGreenImage = page.locator("//img[@class='pony_express']");
        this.orderMessage = page.locator("//h2[@data-test='complete-header']");
        this.orderDispatchedMessage = page.locator("//div[@data-test='complete-text']");
        this.backHomeButton = page.getByRole('button', {name: 'Back Home'});

    }

    public getCheckoutCompleteTitle(): Locator {
        return this.checkoutCompletetitle;
    }

    public getOrderMessage(): Locator {
        return this.orderMessage;
    }

    public getOrderDispatchedMessage(): Locator {
        return this.orderDispatchedMessage;
    }

    public getConfirmationGreenTick(): Locator {
        return this.checkoutGreenImage;
    }

    async clickBackHomeButton(): Promise<void> {
        return await this.backHomeButton.click();
    }
    
    public getBackHomeButtonVisible(): Locator {
        return this.backHomeButton;
    }

    public getShoppingCartBadge(): Locator {
        return this.shoppingCartBadge; //aunque este locator está oculto, lo podemos llamar para validar que no esté visible la cantidad.
    }
    




}