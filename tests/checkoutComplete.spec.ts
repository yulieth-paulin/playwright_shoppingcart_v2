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
        
        
        await expect(page).toHaveURL('/checkout-complete.html');
        await expect(checkoutCompletePage.getCheckoutCompleteTitle()).toHaveText("Checkout: Complete!".trim())
        await expect(checkoutCompletePage.getOrderMessage()).toHaveText("Thank you for your order!".trim()); 
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
        
        
        await expect(checkoutCompletePage.getBackHomeButtonVisible()).toBeVisible();
        
        await checkoutCompletePage.clickBackHomeButton();
        
        
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
        await checkoutOverviewPage.completeOrder(); 

        const checkoutCompletePage = new CheckoutCompletePage(page); 

        
        await expect(page).toHaveURL('/checkout-complete.html')
        
        
        await expect(checkoutCompletePage.getShoppingCartBadge()).toBeHidden(); 

        
      });
    });