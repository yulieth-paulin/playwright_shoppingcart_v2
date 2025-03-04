import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';
import { InventoryPage } from '../src/inventory';
import { log } from 'console';
import { expectedProductNames } from '../data/productsData';
import { CheckoutInformation } from '../src/checkoutInfo';
import exp from 'constants';
import { CheckoutOverviewPage } from '../src/checkoutOverview';
import { console, url } from 'inspector';


test.describe("Shopping cart product challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("https://www.saucedemo.com/");
    });

    test("Verify the checkout overview page loads successfully", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomproductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToChekoutInfoPage();
        
        // Validar si el botón "Continue" es visible antes de hacer clic
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible(); //antes de llenar todos los campos, debemos de validar que el botón esté visible, si lo pongo después de llenarlos me saldrá error.

        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '7689027888');
       
        // Assertion:checkout overview page should load correctly, displaying product details, payment, shipping, and total price information
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
        
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        
        await expect(checkoutOverviewPage.isProductNamevisible()).toBeTruthy(); //Usa toBeTruthy(); cuando solo necesitas comprobar si algo existe o es visible. NO lo uses cuando necesitas validar/comparar valores exactos.
        await expect(checkoutOverviewPage.isProductdescriptionVisible()).toBeTruthy();
        await expect(checkoutOverviewPage.isProductPriceVisible()).toBeTruthy();
        await expect(checkoutOverviewPage.getPaymentInfo()).toBeVisible();
        await expect(checkoutOverviewPage.getShippingInfo()).toBeVisible();
        await expect(checkoutOverviewPage.getPriceTotal()).toBeVisible();
        await expect(checkoutOverviewPage.getFinishButton()).toBeVisible();
        
      });

      test("Verify that the correct product details are displayed", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        
        // Guardamos los detalles del producto agregado al carrito para luego ser comparado
        const selectedProduct =  await inventoryPage.addRandomproductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToChekoutInfoPage();
        
        // Validar si el botón "Continue" es visible antes de hacer clic
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible(); //antes de llenar todos los campos, debemos de validar que el botón esté visible, si lo pongo después de llenarlos me saldrá error.

        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '7689027888');
       
        const checkoutOverviewPage = new CheckoutOverviewPage(page);

        // Assertion:Product name, description, and price should match the selected product
        const checkoutProductName = await checkoutOverviewPage.getProductName();
        const checkoutProductDescription = await checkoutOverviewPage.getProductDescription();
        const checkoutProductPrice = await checkoutOverviewPage.getProductPrice();

        //Comparamos los detalles del checkoutoverview
        expect(checkoutProductName).toBe(selectedProduct.name);
        expect(checkoutProductDescription).toBe(selectedProduct.description);
        expect(checkoutProductPrice).toBe(selectedProduct.price); 
        
      });

      test("Verify the total price calculation is correct", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user', 'secret_sauce');
    
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomproductToCart();
        await inventoryPage.goToCart();
    
        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToChekoutInfoPage();
    
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

      test("Verify the Cancel button returns to the cart", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user', 'secret_sauce');
    
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomproductToCart();
        await inventoryPage.goToCart();
    
        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToChekoutInfoPage();
    
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible();
        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '7689027888');
    
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        await checkoutOverviewPage.returnToTheCart();
    
        //Assertion: URL and Title are correct.
        await expect(checkoutOverviewPage.returnToTheProductPage()).toHaveText("Products")
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        
      });

      test("Complete the order successfully", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user', 'secret_sauce');
    
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomproductToCart();
        await inventoryPage.goToCart();
    
        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToChekoutInfoPage();
    
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible();
        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '7689027888');
    
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        await checkoutOverviewPage.completeOrder();
    
        //Assertion: 
        await expect(checkoutOverviewPage.getHeaderMessage()).toHaveText("Thank you for your order!");
        await expect(checkoutOverviewPage.getOrderDispatchedMessage()).toHaveText("Your order has been dispatched, and will arrive just as fast as the pony can get there!");
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
        
      });


    });