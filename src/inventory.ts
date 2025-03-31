import { Locator, Page } from "@playwright/test";

export class InventoryPage {
    private readonly shoppingCartIcon: Locator; 
    private readonly inventoryItemImage: Locator; 
    private readonly inventoryItemName: Locator;
    private readonly inventoryItemDescription: Locator;
    private readonly inventoryItemPrice: Locator;
    private readonly productSortContainer: Locator;
    private readonly cartBadge: Locator; 
    private readonly inventoryItems: Locator;
    private readonly removeButton: Locator;
    private readonly itemQuantity: Locator;

    constructor(page: Page){
        this.shoppingCartIcon = page.locator("//a[@class='shopping_cart_link']"); 
        this.inventoryItemImage = page.locator("//div[@class='inventory_item_img']"); 
        this.inventoryItemName = page.locator("//div[@data-test='inventory-item-name']");
        this.inventoryItemDescription = page.locator("//div[@data-test='inventory-item-desc']"); 
        this.inventoryItemPrice = page.locator("//div[@class='inventory_item_price']") 
        this.productSortContainer = page.locator("//select[@data-test='product-sort-container']");
        this.cartBadge = page.locator("//span[@class='shopping_cart_badge']"); 
        this.inventoryItems = page.locator(".inventory_item"); 
        this.removeButton = page.getByRole('button', {name: 'Remove'});
        this.itemQuantity = page.locator("//div[@data-test='item-quantity']");  

    }

    public getAllProductNames(): Locator {  
        return this.inventoryItemName; 
    }

    public getAllProductDescriptions(): Locator {
        return this.inventoryItemDescription; 
    }

    public getAllProductImages(): Locator {
        return this.inventoryItemImage;
    }

    async getProductCount(): Promise<number> {
        return await this.inventoryItemName.count();
    }

    public getAllPrices(): Locator {
        return this.inventoryItemPrice; 
    }

    public sortProductsByPriceLowToHigh(): Locator { 
        return this.productSortContainer; 
     }

    public sortProductsByNameZtoA(): Locator {
        return this.productSortContainer; 
    }

    async addRandomProductToCart(): Promise<{name: string; description: string; price: string}> { 

        const productCount = await this.inventoryItems.count(); 
        const randomIndex = Math.floor(Math.random() * productCount); 
        
        const randomProduct = this.inventoryItems.nth(randomIndex); 
        

        const productName = await randomProduct.locator('.inventory_item_name').innerText();
        const productDescription = await randomProduct.locator('.inventory_item_desc').innerText();
        const productPrice = await randomProduct.locator('.inventory_item_price').innerText();

        await randomProduct.locator('button').click();

        return { name: productName, description: productDescription, price: productPrice }; 
        
    }

    public getInventoryItems(): Locator {
        return this.inventoryItems;
    };
    

    public getCartCount(): Locator {
        return this.cartBadge;
    }

    async goToCart(): Promise<void> {
        await this.shoppingCartIcon.click();
       
    }

    async removeProductFromCart(): Promise<void> {
        await this.removeButton.click();
    }

    public getCartBadge(): Locator { 
        return this.cartBadge;
    }

    public getQuantityLocator(): Locator{ 
        return this.itemQuantity;
    }

}