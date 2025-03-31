import { Locator, Page } from "@playwright/test";

export class CheckoutOverviewPage {
    private readonly itemName: Locator;
    private readonly itemDescription: Locator;
    private readonly itemPrice: Locator;
    private readonly paymentInformationLabel: Locator;
    private readonly shippingInfoLabel: Locator;
    private readonly priceTotalInfoLabel: Locator;
    private readonly subtotalValue: Locator;
    private readonly taxValue: Locator;
    private readonly totalProduct: Locator;
    private readonly cancelButton: Locator;
    private readonly finishButton: Locator;
    private readonly productTitle: Locator;
    private readonly completeHeaderMessage: Locator;
    private readonly completeOrderMessage: Locator;

    constructor (page:Page){
        this.itemName = page.locator("//div[@data-test='inventory-item-name']");
        this.itemDescription = page.locator("//div[@data-test='inventory-item-desc']");
        this.itemPrice = page.locator("//div[@class='inventory_item_price']");
        this.paymentInformationLabel = page.locator("//div[@data-test='payment-info-label']");
        this.shippingInfoLabel = page.locator("//div[@data-test='shipping-info-label']");
        this.priceTotalInfoLabel = page.locator("//div[@data-test='total-info-label']");
        this.subtotalValue = page.locator("//div[@data-test='subtotal-label']");
        this.taxValue = page.locator("//div[@data-test='tax-label']");
        this.totalProduct = page.locator("//div[@data-test='total-label']");
        this.cancelButton = page.locator("//button[@id='cancel']");
        this.finishButton = page.getByRole('button', {name: 'Finish'});
        this.productTitle = page.locator("//span[@data-test='title']");
        this.completeHeaderMessage = page.getByRole('heading', {name: 'Thank you for your order!'});
        this.completeOrderMessage = page.locator("//div[@data-test='complete-text']");
    }

    public getProductName(): Locator {
        return this.itemName; 
    }

    public getProductDescription(): Locator {
        return this.itemDescription; 
    }

    public getProductPrice(): Locator { 
        return this.itemPrice; 
    }

    public getPaymentInfo(): Locator { 
        return this.paymentInformationLabel;
    }

    public getShippingInfo(): Locator { 
        return this.shippingInfoLabel;
    }

    public getPriceTotal(): Locator {
        return this.priceTotalInfoLabel;
    }

    public getFinishButton(): Locator { 
        return this.finishButton;
    }

    public isProductNamevisible(): Locator{
        return this.itemName; 
    }

    public isProductdescriptionVisible(): Locator{
        return this.itemDescription;
    }

    public isProductPriceVisible(): Locator{
        return this.itemPrice;
    }

    async getTotalProduct(): Promise<string>{ 
        const totalText = await this.totalProduct.innerText();
        console.log("Total UI :", totalText);
    
        // Extrae solo el número y convierte a float. Elimina el símbolo $ y convierte los valores a números.
        const totalp = parseFloat(totalText.replace(/[^\d.]/g, "")) || 0; //Usa una expresión regular (/[^\d.]/g, "") para eliminar cualquier carácter que no sea un número o un punto decimal. Convierte "$49.99" en "49.99"
    
        console.log("Total UI (converted):", totalp);
    
        return `$${totalp.toFixed(2)}`; 
    }

    async getTotalCalculation(): Promise<string> {
        const subtotalText = await this.subtotalValue.innerText(); 
        const taxText = await this.taxValue.innerText(); 
    
        console.log("Subtotal :", subtotalText); 
        console.log("Tax :", taxText);
    
        // Limpiar y convertir valores numéricos
        const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, "")) || 0; 
        const tax = parseFloat(taxText.replace(/[^\d.]/g, "")) || 0;
    
        console.log("Subtotal (converted):", subtotal); 
        console.log("Tax (converted):", tax);
    
        
        const total = (subtotal + tax).toFixed(2); 
    
        console.log("GRAN TOTAL: ", total); 
    
        return `$${total}`; //Devuelve el total formateado con un símbolo de dólar al inicio ("$53.99").
    }

    public getSubtotalLocator(): Locator {
        return this.subtotalValue;
    }
    
    public getTaxLocator(): Locator {
        return this.taxValue;
    }
    
    public getTotalLocator(): Locator {
        return this.totalProduct;
    }

    async returnToTheCart(): Promise<void> {
        return await this.cancelButton.click();
    }

    public returnToTheProductPage(): Locator {
        return this.productTitle;

    }

    async completeOrder(): Promise<void> {
        return await this.finishButton.click(); 

    }

    public getHeaderMessage(): Locator {
        return this.completeHeaderMessage;
    }

    public getOrderDispatchedMessage(): Locator {
        return this.completeOrderMessage;
    }

}