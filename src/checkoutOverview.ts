import { Locator, Page } from "@playwright/test";

export class CheckoutOverviewPage {
    private readonly itemName: Locator;
    private readonly itemDescription: Locator;
    private readonly itemPrice: Locator;
    private readonly cartQuantity: Locator;
    private readonly paymentInformationLabel: Locator;
    private readonly sauceCardValue: Locator;
    private readonly shippingInfoLabel: Locator;
    private readonly freePonyexpressValue: Locator;
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
        this.cartQuantity = page.locator("//div[@class='cart_quantity']");
        this.paymentInformationLabel = page.locator("//div[@data-test='payment-info-label']");
        this.sauceCardValue = page.locator("//div[@data-test='payment-info-value']");
        this.shippingInfoLabel = page.locator("//div[@data-test='shipping-info-label']");
        this.freePonyexpressValue = page.locator("//div[@data-test='shipping-info-value']");
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

    async getProductName(): Promise<string> {
        return await this.itemName.innerText(); //.innerText() → Extrae el texto visible del Locator, que es el nombre del producto. Usa innerText() si solo hay un producto (retorna string).
    }

    async getProductDescription(): Promise<string> {
        return await this.itemDescription.innerText(); 
    }

    async getProductPrice(): Promise<string> { 
        return await this.itemPrice.innerText(); 
    }

    public getPaymentInfo(): Locator { //No tiene sentido hacer async en este caso, porque this.itemName no es una operación asíncrona. Solo deberías hacer async si el método realiza una operación asíncrona como click(), innerText(), isVisible(), etc.
        return this.paymentInformationLabel;
    }

    public getShippingInfo(): Locator { //page.locator(selector) es una operación sincrónica, por lo que no necesita async ni await.
        return this.shippingInfoLabel;
    }

    public getPriceTotal(): Locator {
        return this.priceTotalInfoLabel;
    }

    public getFinishButton(): Locator { //Siempre que un método solo devuelva un Locator, debe ser public y sin async, porque obtener un Locator no es una operación asíncrona.
        return this.finishButton;
    }

    async isProductNamevisible(): Promise<boolean>{
        return await this.itemName.isVisible(); //retorna true o false
    }

    async isProductdescriptionVisible(): Promise<boolean>{
        return await this.itemDescription.isVisible();
    }

    async isProductPriceVisible(): Promise<boolean>{
        return await this.itemPrice.isVisible();
    }

    async getTotalProduct(): Promise<string>{ //Gran total
        const totalText = await this.totalProduct.innerText();
        console.log("Total UI (raw text):", totalText);
    
        // Extrae solo el número y convierte a float. Elimina el símbolo $ y convierte los valores a números.
        const totalp = parseFloat(totalText.replace(/[^\d.]/g, "")) || 0; //Usa una expresión regular (/[^\d.]/g, "") para eliminar cualquier carácter que no sea un número o un punto decimal. Convierte "$49.99" en "49.99"
    
        console.log("Total UI (converted):", totalp);
    
        return `$${totalp.toFixed(2)}`; //Asegura que el resultado tenga exactamente 2 decimales (importante para valores monetarios).
    }

    async getTotalCalculation(): Promise<string> {
        const subtotalText = await this.subtotalValue.innerText(); //Obtiene el texto del subtotal desde la UI. Ejemplo de valor esperado: "$49.99"
        const taxText = await this.taxValue.innerText(); //Obtiene el texto del impuesto desde la UI. Ejemplo de valor esperado: "$4.00"
    
        console.log("Subtotal (raw text):", subtotalText); //Subtotal (raw text): $49.99
        console.log("Tax (raw text):", taxText);
    
        // Limpiar y convertir valores numéricos
        const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, "")) || 0; //Si parseFloat() devuelve NaN (no numérico) (por ejemplo, si el texto estuviera vacío), se asigna 0 como valor predeterminado.
        const tax = parseFloat(taxText.replace(/[^\d.]/g, "")) || 0;
    
        console.log("Subtotal (converted):", subtotal); //Muestra los valores convertidos en consola para verificar que la conversión de texto a número fue correcta. 49.99
        console.log("Tax (converted):", tax);
    
        // Calcular el total correctamente
        const total = (subtotal + tax).toFixed(2); //el total lo muetsra con 2 decimales para temas de precio. 
    
        console.log("GRAN TOTAL: ", total); // 53.99
    
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

    async completeOrder() {
        return await this.finishButton.click(); 

    }

    public getHeaderMessage(): Locator {
        return this.completeHeaderMessage;
    }

    public getOrderDispatchedMessage(): Locator {
        return this.completeOrderMessage;
    }

}