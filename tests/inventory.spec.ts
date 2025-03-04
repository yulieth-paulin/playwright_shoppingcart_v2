import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';
import { InventoryPage } from '../src/inventory';
import { log } from 'console';
import { expectedProductNames } from '../data/productsData';


test.describe("Inventory challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("https://www.saucedemo.com/");
    });

    test("Verify product listing", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
        const inventoryPage = new InventoryPage(page);
        const productNames = await inventoryPage.getAllProductNames();
        const productDescriptions = await inventoryPage.getAllProductDescriptions();
        const productImageCount = await inventoryPage.getAllProductImages();
        const totalProducts = await inventoryPage.getProductCount(); 
        const productPrices = await inventoryPage.getAllPrices();

        console.log("\n=== Product List ===");
        for (let i = 0; i < totalProducts; i++){
            console.log(`\nProduct ${i + 1}:`);
            console.log(`Name: ${productNames[i]}`);
            console.log(`Description: ${productDescriptions[i]}`);
            console.log(`Price: ${productPrices[i]}`);
        }

        console.log("\nTotal Products:", totalProducts);
        console.log("Total Product Images:", productImageCount);

        //Assertion: All product names and totals are displayed correctly.
        expect(productNames).toEqual(expectedProductNames); //Aqui se invoca el archivo "productsData" que contiene todos los nombres de los productos.
        expect(totalProducts).toBeGreaterThan(0);
        expect(productImageCount).toBe(totalProducts);
        expect(productNames.length).toBe(totalProducts);
        expect(productDescriptions.length).toBe(totalProducts);
      });
      
      test("Verify sorting by price (low to high)", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.sortProductsByPriceLowToHigh();
        
        // Obtener los precios después de ordenar
        const prices = await inventoryPage.getAllPrices();

        // Convertir los precios de string a number
        const numericPrices = prices.map(price => parseFloat(price.replace('$' , '')));

        // Crear una copia del array de precios y ordenarla de menor a mayor
        const sortedPrices = [...numericPrices].sort((a , b ) => a - b); //[...numericPrices], hacemos una copia y trabajamos sobre la copia, dejando el array original intacto. .sort() → Ordena los elementos del array, pero por defecto lo hace alfabéticamente (no numéricamente).Por eso necesitamos proporcionar una función de comparación.a - b) → Ordena numéricamente el array en orden ascendente.
        
        //Assertion: Products are sorted by ascending price.
        expect(numericPrices).toEqual(sortedPrices);
        console.log("Prices after sorting (low to high) :", numericPrices);
      });

      test("Verify sorting by product name (Z to A)", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.sortProductsByNameZtoA();

        // Obtener los nombres después de ordenar
        const productNames = await inventoryPage.getAllProductNames(); 
        
        // Verificación: Compara el array obtenido con uno ordenado de Z a A
        const sortedNames = [...productNames].sort().reverse(); //...productNames -> Crea una copia del array original. .sort() -> Ordena la copia de forma ascendente (A a Z)..reverse() -> Invierte el orden para que sea descendente (Z a A).
        
        // Assertion: Products are sorted alphabetically from Z to A
        expect(productNames).toEqual(sortedNames);
        console.log("Product names after sorting name (Z to A):", productNames);
      });

      test("Verify adding a random product to cart", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        // Add a random product to the cart
        await inventoryPage.addRandomproductToCart();
        
        //Assertion: The product is successfully added to the cart
        const cartCount = await inventoryPage.getCartCount();
        expect(cartCount).toBe('1');

      });

      test("Verify removing a product from the cart", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
         // Añadir un producto aleatorio al carrito
        const productName = await inventoryPage.addRandomproductToCart();
        
        // Ir al carrito 
        await inventoryPage.goToCart();
        
        //Remover el producto del carrito
        await inventoryPage.removeProductFromCart();
        
        //Assertion: The product is successfully removed from the cart
        //expect(cartItems).toBe(''); 
        
        const productItems = await inventoryPage.getAllProductNames();
        expect(productItems).not.toContain(productName);
        
        await expect(inventoryPage.getCartBadge()).not.toBeVisible(); 

      });

      test("Verify adding the same product multiple times", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
         // Añadir un producto aleatorio al carrito
        await inventoryPage.addRandomproductToCart();
        
        // Ir al carrito 
        await inventoryPage.goToCart();
        
        
        //Assertion: que el campo quantity exista y que su valor sea igual a 1 producto. 
        await expect(inventoryPage.getQuantityLocator()).toBeVisible();
        await expect(inventoryPage.getQuantityLocator()).toHaveText('1');
        //expect(quantity.trim()).toBe('1'); //Se usa trim()para evitar errores por espacios.

      });


    }); 
