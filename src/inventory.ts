import { Locator, Page } from "@playwright/test";

export class InventoryPage {
    private readonly page: Page;
    private readonly shoppingCartIcon: Locator;
    private readonly sortProducCombobox: Locator;
    private readonly inventoryItemImage: Locator;
    private readonly inventoryItemName: Locator;
    private readonly inventoryItemDescription: Locator;
    private readonly inventoryItemPrice: Locator;
    private readonly addToCartButton: Locator;
    private readonly productSortContainer: Locator;
    private readonly cartBadge: Locator; 
    private readonly inventoryItems: Locator;
    private readonly removeButton: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly itemQuantity: Locator;

    constructor(page: Page){
        this.page = page;
        this.shoppingCartIcon = page.locator("//a[@class='shopping_cart_link']");
        this.sortProducCombobox = page.locator("//span[@class='select_container']");
        this.inventoryItemImage = page.locator("//div[@class='inventory_item_img']"); //trae todas las 6 imágenes
        this.inventoryItemName = page.locator("//div[@data-test='inventory-item-name']"); //trae todos los nombres
        this.inventoryItemDescription = page.locator("//div[@data-test='inventory-item-desc']"); //trae todas las descrip.
        this.inventoryItemPrice = page.locator("//div[@class='inventory_item_price']") // trae todos los precios.
        this.addToCartButton = page.getByRole('button', {name: 'Add to cart'}); 
        this.productSortContainer = page.locator("//select[@data-test='product-sort-container']");
        this.cartBadge = page.locator("//span[@class='shopping_cart_badge']"); //apunta al contador de productos en el carrito.
        this.inventoryItems = page.locator(".inventory_item"); //locator que apunta a todos los elementos de productos en la página.
        this.removeButton = page.getByRole('button', {name: 'Remove'});
        this.continueShoppingButton = page.getByTestId('continue-shopping');
        this.itemQuantity = page.locator("//div[@data-test='item-quantity']"); //Cantidad del mismo producto agregado al carrito. 

    }

    async getAllProductNames(): Promise<string[]> {
        return await this.inventoryItemName.allInnerTexts(); //.allInnerTexts() en Playwright se usa para obtener todos los textos internos (innerText) de una colección de elementos coincidentes con un selector.
    }

    async getAllProductDescriptions(): Promise<string[]> {
        return await this.inventoryItemDescription.allInnerTexts(); //allInnerTexts() es útil solo cuando esperas múltiples elementos (como una lista de productos o precios). Obtiene un array con los textos visibles de todos los elementos que coinciden con el localizador.
    }

    async getAllProductImages(): Promise<number> {
        return await this.inventoryItemImage.count();
    }

    async getProductCount(): Promise<number> {
        return await this.inventoryItemName.count();
    }

    async getAllPrices(): Promise<string[]> {
        return await this.inventoryItemPrice.allTextContents(); //allTextContents(); Verificación de todo el contenido, visible o no
    }

    async sortProductsByPriceLowToHigh(): Promise<void> { // Usa Promise<void> para acciones sin retorno.
       await this.productSortContainer.selectOption({label: 'Price (low to high)'}); //selectOption se usa para interactuar con el menú desplegable y seleccionar el ordenamiento.
    }

    async sortProductsByNameZtoA(): Promise<void> {
        await this.productSortContainer.selectOption({label: 'Name (Z to A)'}); //label: Se refiere al texto visible de una opción dentro de un <select> HTML. o también se puede usar value y ponerle su valor.
    }

    //Seleccionar un producto aleatorio
    async addRandomproductToCart(): Promise<{ name: string; description: string; price: string }>{ //Esta función es asincrónica porque utiliza await para manejar las operaciones que involucran interacción con la página.
        const productCount = await this.inventoryItems.count(); //count() devuelve el número total de elementos coincidentes. en este caso serían 6. await espera a que esa promesa se resuelva antes de asignar el valor a productCount
        const randomIndex = Math.floor(Math.random() * productCount); //Math.random() devuelve un número decimal entre 0 y 1 (por ejemplo, 0.728).
        
        const randomProduct = this.inventoryItems.nth(randomIndex); //nth(index) es un método de Playwright que selecciona el elemento en la posición index dentro de los elementos encontrados.Selecciona uno aleatorio usando .nth(randomIndex)
        const productName = await randomProduct.locator('.inventory_item_name').innerText();
        const productDescription = await randomProduct.locator('.inventory_item_desc').innerText();
        const productPrice = await randomProduct.locator('.inventory_item_price').innerText();

        console.log(`Adding to cart: ${productName} - ${productDescription} - ${productPrice}`);

        const randomProductButton = randomProduct.locator('button');
        await randomProductButton.click();

        return { name: productName, description: productDescription, price: productPrice }; //devuelve un objeto con { name, description, price }. 
        

    }

    async getCartCount(): Promise<string> {
        return this.cartBadge.innerText(); //innerText() obtiene el texto visible del elemento, que debería ser el número de productos actualmente en el carrito. Obtiene el texto visible de un solo elemento.
    }

    async goToCart(){
        await this.shoppingCartIcon.click();
       
    }

    async removeProductFromCart(){
        await this.removeButton.click();
    }

    public getCartBadge(): Locator{ //El método retorna un Locator, que es un objeto de Playwright usado para interactuar con elementos en la página.
        return this.cartBadge;
    }

    public getQuantityLocator(): Locator{ //Método para validar que el campo QTY exista. Con el locator puedo iusar cualquier assertion en el Test.
        return this.itemQuantity;
    }





}