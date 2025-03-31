import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';
import { InventoryPage } from '../src/inventory';
import { expectedProductNames } from '../data/productsData';


test.describe("Inventory challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test("Verify product listing", async ({ page }) => { 
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
        const inventoryPage = new InventoryPage(page);
        const productNames = await inventoryPage.getAllProductNames().allInnerTexts();
        const productDescriptions = await inventoryPage.getAllProductDescriptions().allInnerTexts();
        const productImageCount = await inventoryPage.getAllProductImages().count();
        const totalProducts = await inventoryPage.getProductCount(); 
        const productPrices = await inventoryPage.getAllPrices().allInnerTexts();

        console.log("\n=== Product List ===");
        for (let i = 0; i < totalProducts; i++){ 
            console.log(`\nProduct ${i + 1}:`); 
            console.log(`Name: ${productNames[i]}`);
            console.log(`Description: ${productDescriptions[i]}`);
            console.log(`Price: ${productPrices[i]}`);
        }

        console.log("\nTotal Products:", totalProducts);
        console.log("Total Product Images:", productImageCount);

      
        expect(productNames).toEqual(expectedProductNames); 
        expect(totalProducts).toBeGreaterThan(0);
        expect(productImageCount).toBe(totalProducts);
        expect(productNames.length).toBe(totalProducts);
        expect(productDescriptions.length).toBe(totalProducts);

      });
      
      test("Verify sorting by price (low to high)", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.sortProductsByPriceLowToHigh().selectOption({label: 'Price (low to high)'});
        
       
        const prices = await inventoryPage.getAllPrices().allInnerTexts(); 
        const numericPrices = prices.map(price => parseFloat(price.replace('$' , ''))); 

      
        const sortedPrices = [...numericPrices].sort((a , b ) => a - b); 
        
        expect(numericPrices).toEqual(sortedPrices);
        console.log("Prices after sorting (low to high) :", numericPrices);

      });

      test("Verify sorting by product name (Z to A)", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.sortProductsByNameZtoA().selectOption({label: 'Name (Z to A)'});  

        // Obtener los nombres después de ordenar
        const productNames = await inventoryPage.getAllProductNames().allInnerTexts(); 
        
        
        const sortedNames = [...productNames].sort().reverse(); 
        
        // Assertion: Products are sorted alphabetically from Z to A
        expect(productNames).toEqual(sortedNames);
        console.log("Product names after sorting name (Z to A):", productNames);

      });

      test("Verify adding a random product to cart", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce'); 

        const inventoryPage = new InventoryPage(page);
        const product = await inventoryPage.addRandomProductToCart(); 

        console.log(`Adding to cart: ${product.name} - ${product.description} - ${product.price}`);
        

        await expect(inventoryPage.getCartCount()).toHaveText('1'); 

      });
    

      test("Verify removing a product from the cart", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
        
        const productName = await inventoryPage.addRandomProductToCart();
        
         
        await inventoryPage.goToCart();
        
        
        await inventoryPage.removeProductFromCart();
         
        const productItems = await inventoryPage.getAllProductNames().allInnerTexts();
        expect(productItems).not.toContain(productName);
        
        await expect(inventoryPage.getCartBadge()).not.toBeVisible(); 

      });

      test("Verify adding the same product multiple times", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
        
        await inventoryPage.addRandomProductToCart();
        
     
        await inventoryPage.goToCart();
         
        await expect(inventoryPage.getQuantityLocator()).toBeVisible();
        await expect(inventoryPage.getQuantityLocator()).toHaveText('1');


      });


    }); 
