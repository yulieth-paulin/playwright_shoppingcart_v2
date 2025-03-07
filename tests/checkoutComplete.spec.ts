import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';
import { InventoryPage } from '../src/inventory';
import { expectedProductNames } from '../data/productsData';
import { CheckoutInformation } from '../src/checkoutInfo';
import { CheckoutOverviewPage } from '../src/checkoutOverview';
import { CheckoutCompletePage } from '../src/checkoutComplete';

test.describe("Shopping cart product challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("https://www.saucedemo.com/");
    });

test("Verify sucessful order completion", async ({ page }) => {
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

        const checkoutCompletePage = new CheckoutCompletePage(page);
        
        //Assertion: The user is redirected to the "Checkout Complete" page with a confirmation message
        await page.waitForURL("https://www.saucedemo.com/checkout-complete.html"); //Añadir waitForURL() para evitar fallas intermitentes. Agrega un waitForURL() para asegurarte de que la navegación está completa
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
        await expect(checkoutCompletePage.getCheckoutCompleteTitle()).toHaveText("Checkout: Complete!")
        
      });

      test("Validate 'Thank you for your order!' message", async ({ page }) => {
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

        const checkoutCompletePage = new CheckoutCompletePage(page);
        
        //Assertion: The user is redirected to the "Checkout Complete" page with a confirmation message
        await expect(checkoutCompletePage.getOrderMessage()).toBeVisible(); //Esto asegura que el mensaje ha cargado antes de hacer la aserción.
        await expect(checkoutCompletePage.getConfirmationGreenTick()).toBeVisible();
        await expect(checkoutCompletePage.getOrderMessage()).toHaveText("Thank you for your order!".trim()); //.trim() asegurarte de que no haya espacios extra al inicio o al final
        
      });

      test("Verify order dispatch message", async ({ page }) => {
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

        const checkoutCompletePage = new CheckoutCompletePage(page);
        
        //Assertion: The user is redirected to the "Checkout Complete" page with a confirmation message
        await expect(checkoutCompletePage.getOrderDispatchedMessage()).toBeVisible(); //Esto asegura que el mensaje ha cargado antes de hacer la aserción.
        await expect(checkoutCompletePage.getOrderDispatchedMessage()).toHaveText("Your order has been dispatched, and will arrive just as fast as the pony can get there!".trim()); //.trim() asegurarte de que no haya espacios extra al inicio o al final
        
      });

      test("Validate 'Back Home' button functionality", async ({ page }) => {
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

        const checkoutCompletePage = new CheckoutCompletePage(page);
        
        //Assertion: Back home button is available before clicking.
        await expect(checkoutCompletePage.getBackHomeButtonVisible()).toBeVisible();
        
        await checkoutCompletePage.clickBackHomeButton();
        
        //Assertion: The user is redirected to the homepage (inventory page).
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
        
      });

      test("Check the cart is empty after completing the order", async ({ page }) => {
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
        await checkoutOverviewPage.completeOrder(); //va al método de completar una orden exitosamente

        const checkoutCompletePage = new CheckoutCompletePage(page); //llama al método

        //Assertion: The user is redirected to the complete page.
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html")
        
        //Assertion: Back home button is available before clicking.
        await expect(checkoutCompletePage.getShoppingCartBadge()).toBeHidden(); //toBeHidden() verifica que el elemento no esté visible en la pantalla.

        
      });
    });