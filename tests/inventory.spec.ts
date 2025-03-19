import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';
import { InventoryPage } from '../src/inventory';
import { expectedProductNames } from '../data/productsData';


test.describe("Inventory challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test("Verify product listing", async ({ page }) => { //Recibe el page para interactuar con la web.
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
        const inventoryPage = new InventoryPage(page);
        const productNames = await inventoryPage.getAllProductNames().allInnerTexts();
        const productDescriptions = await inventoryPage.getAllProductDescriptions().allInnerTexts();
        const productImageCount = await inventoryPage.getAllProductImages().count();
        const totalProducts = await inventoryPage.getProductCount(); 
        const productPrices = await inventoryPage.getAllPrices().allInnerTexts();

        console.log("\n=== Product List ===");
        for (let i = 0; i < totalProducts; i++){ // el bucle for imprime todos los productos de la lista.
            console.log(`\nProduct ${i + 1}:`); //${} template literals.
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
        await inventoryPage.sortProductsByPriceLowToHigh().selectOption({label: 'Price (low to high)'});
        
        // Obtener los precios después de ordenar
        const prices = await inventoryPage.getAllPrices().allInnerTexts(); //Aquí obtengo un array de strings de todos los precios. 
        // Convertir los precios de string a number
        const numericPrices = prices.map(price => parseFloat(price.replace('$' , ''))); //.map recorre el array

        // Crear una copia del array de precios y ordenarla de menor a mayor
        const sortedPrices = [...numericPrices].sort((a , b ) => a - b); //Aquí estoy haciendo un ordenamiento manual y el[...numericPrices], hacemos una copia y trabajamos sobre la copia, dejando el array original intacto. .sort() → Ordena los elementos del array, pero por defecto lo hace alfabéticamente (no numéricamente).Por eso necesitamos proporcionar una función de comparación.a - b) → Ordena numéricamente el array en orden ascendente.
        
        //Assertion: Products are sorted by ascending price.
        expect(numericPrices).toEqual(sortedPrices);
        console.log("Prices after sorting (low to high) :", numericPrices);

      });

      test("Verify sorting by product name (Z to A)", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.sortProductsByNameZtoA().selectOption({label: 'Name (Z to A)'}); //label: Se refiere al texto visible de una opción dentro de un <select> HTML. o también se puede usar value y ponerle su valor.

        // Obtener los nombres después de ordenar
        const productNames = await inventoryPage.getAllProductNames().allInnerTexts(); //el allInnerTexts extrae el texto
        
        // Verificación: Compara el array obtenido con uno ordenado de Z a A
        const sortedNames = [...productNames].sort().reverse(); //...productNames -> Crea una copia del array original. .sort() -> Ordena la copia de forma ascendente (A a Z)..reverse() -> Invierte el orden para que sea descendente (Z a A).
        
        // Assertion: Products are sorted alphabetically from Z to A
        expect(productNames).toEqual(sortedNames);
        console.log("Product names after sorting name (Z to A):", productNames);

      });

      test("Verify adding a random product to cart", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        const product = await inventoryPage.addRandomProductToCart(); // selecciona un producto aleatorio.

        console.log(`Adding to cart: ${product.name} - ${product.description} - ${product.price}`);
        
        //Assertion: The product is successfully added to the cart
        await expect(inventoryPage.getCartCount()).toHaveText('1'); 

      });
    

      test("Verify removing a product from the cart", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
         // Añadir un producto aleatorio al carrito
        const productName = await inventoryPage.addRandomProductToCart();
        
        // Ir al carrito 
        await inventoryPage.goToCart();
        
        //Remover el producto del carrito
        await inventoryPage.removeProductFromCart();
        
        //Assertion: The product is successfully removed from the cart 
        const productItems = await inventoryPage.getAllProductNames().allInnerTexts();
        expect(productItems).not.toContain(productName);
        
        await expect(inventoryPage.getCartBadge()).not.toBeVisible(); 

      });

      test("Verify adding the same product multiple times", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
         // Añadir un producto aleatorio al carrito
        await inventoryPage.addRandomProductToCart();
        
        // Ir al carrito 
        await inventoryPage.goToCart();
        
        
        //Assertion: que el campo quantity exista y que su valor sea igual a 1 producto. 
        await expect(inventoryPage.getQuantityLocator()).toBeVisible();
        await expect(inventoryPage.getQuantityLocator()).toHaveText('1');


      });


    }); 
