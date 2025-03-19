import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';
import { InventoryPage } from '../src/inventory';
import { CheckoutInformation } from '../src/checkoutInfo';
import { CheckoutOverviewPage } from '../src/checkoutOverview';
import { CheckoutCompletePage } from '../src/checkoutComplete';

test.describe("Checkout complete challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

test("Validate that the checkout complete page displays the correct title and success message", async ({ page }) => {
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
        await expect(page).toHaveURL('/checkout-complete.html');
        await expect(checkoutCompletePage.getCheckoutCompleteTitle()).toHaveText("Checkout: Complete!".trim())
        await expect(checkoutCompletePage.getOrderMessage()).toHaveText("Thank you for your order!".trim()); //.trim() asegurarte de que no haya espacios extra al inicio o al final
        await expect(checkoutCompletePage.getOrderDispatchedMessage()).toBeVisible();
        await expect(checkoutCompletePage.getOrderDispatchedMessage()).toHaveText("Your order has been dispatched, and will arrive just as fast as the pony can get there!".trim());
      });

      
      test("Redirects to inventory page when 'Back Home' button is clicked", async ({ page }) => {
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
        
        //Assertion: The user is redirected to the inventory page (inventory page).
        await expect(page).toHaveURL("/inventory.html")
        
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
        await expect(page).toHaveURL('/checkout-complete.html')
        
        //Assertion: Back home button is available before clicking.
        await expect(checkoutCompletePage.getShoppingCartBadge()).toBeHidden(); //toBeHidden() verifica que el elemento no esté visible en la pantalla.

        
      });
    });