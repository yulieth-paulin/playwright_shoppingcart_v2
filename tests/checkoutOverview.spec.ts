import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';
import { InventoryPage } from '../src/inventory';
import { CheckoutInformation } from '../src/checkoutInfo';
import { CheckoutOverviewPage } from '../src/checkoutOverview';


test.describe("Checkout Overview challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test("Validate checkout overview page loads with all required information", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
        
        // Validar si el botón "Continue" es visible antes de hacer clic
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible(); //antes de llenar todos los campos, debemos de validar que el botón esté visible, si lo pongo después de llenarlos me saldrá error.

        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '7689027888');
       
        // Assertion:checkout overview page should load correctly, displaying product details, payment, shipping, and total price information
        await expect(page).toHaveURL("/checkout-step-two.html");
        
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        await expect(checkoutOverviewPage.isProductNamevisible()).toBeVisible(); 
        await expect(checkoutOverviewPage.isProductdescriptionVisible()).toBeVisible();
        await expect(checkoutOverviewPage.isProductPriceVisible()).toBeVisible();
        await expect(checkoutOverviewPage.getPaymentInfo()).toBeVisible();
        await expect(checkoutOverviewPage.getShippingInfo()).toBeVisible();
        await expect(checkoutOverviewPage.getPriceTotal()).toBeVisible();
        await expect(checkoutOverviewPage.getFinishButton()).toBeVisible();
        
      }); 

      test("Product name, description, and price should match the selected product", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        
        // Guardamos los detalles del producto agregado al carrito aleatoriamente para luego ser comparado
        const selectedRandomProduct =  await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
        
        // Validar si el botón "Continue" es visible antes de hacer clic
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible(); //antes de llenar todos los campos, debemos de validar que el botón esté visible, si lo pongo después de llenarlos me saldrá error.

        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '7689027888');
       
        const checkoutOverviewPage = new CheckoutOverviewPage(page);

        
        const checkoutProductName = await checkoutOverviewPage.getProductName().innerText(); //se guarda el valor en la variable el cual se tiene un string, lo que significa que ya no es  una promesa.
        const checkoutProductDescription = await checkoutOverviewPage.getProductDescription().innerText();
        const checkoutProductPrice = await checkoutOverviewPage.getProductPrice().innerText();

        //Assertion:Product name, description, and price should match the selected product
        expect(checkoutProductName).toBe(selectedRandomProduct.name);
        expect(checkoutProductDescription).toBe(selectedRandomProduct.description);
        expect(checkoutProductPrice).toBe(selectedRandomProduct.price); 
        
      });

      test("Verify the total price calculation is correct", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user', 'secret_sauce');
    
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();
    
        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
    
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible();
        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '7689027888');
    
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
    
        // Validar visibilidad de subtotal y tax ANTES de extraer sus valores
        await expect(checkoutOverviewPage.getSubtotalLocator()).toBeVisible();
        await expect(checkoutOverviewPage.getTaxLocator()).toBeVisible();
        await expect(checkoutOverviewPage.getTotalLocator()).toBeVisible();
    
        // Obtener valores y compararlos
        const granTotal = await checkoutOverviewPage.getTotalProduct();
        const calculatedTotal = await checkoutOverviewPage.getTotalCalculation();
    
        expect(calculatedTotal).toBe(granTotal); //se usa para verificar si dos valores son exactamente iguales.
        
      });

      test("Verify the Cancel button returns to the inventory products page", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user', 'secret_sauce');
    
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();
    
        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
    
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible();
        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '7689027888');
    
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        await checkoutOverviewPage.returnToTheCart();
    
        //Assertion: URL and Title are correct.
        await expect(checkoutOverviewPage.returnToTheProductPage()).toHaveText("Products");
        // await expect(checkoutOverviewPage.returnToTheProductPage()).toHaveText("Products")
        await expect(page).toHaveURL('/inventory.html');
        
      });

      test("Verify order is completed successfully with confirmation messages", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user', 'secret_sauce');
    
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();
    
        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
    
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible();
        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '7689027888');
    
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        await checkoutOverviewPage.completeOrder();
    
        //Assertion: 
        await expect(page).toHaveURL("/checkout-complete.html");
        await expect(checkoutOverviewPage.getHeaderMessage()).toHaveText("Thank you for your order!");
        await expect(checkoutOverviewPage.getOrderDispatchedMessage()).toHaveText("Your order has been dispatched, and will arrive just as fast as the pony can get there!");
        
        
      });


    });