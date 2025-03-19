import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';
import { InventoryPage } from '../src/inventory';
import { CheckoutInformation } from '../src/checkoutInfo';


test.describe("Checkout Information challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test("Enter valid checkout information", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
        
        // Validar si el botón "Continue" es visible antes de hacer clic
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible(); //antes de llenar todos los campos, debemos de validar que el botón esté visible, si lo pongo después de llenarlos me saldrá error.

        await checkoutInfoPage.checkoutCorrectInfo('Oliva Florinda','Tamayo Puerta' , '678902345'); 

        await expect(page).toHaveURL('/checkout-step-two.html');
       
      });

      test("Verify placeholders in input fields", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
        
        // Assertion:Validar los placeholders
        await expect(checkoutInfoPage.getPlaceHolderFisrtName()).toHaveAttribute('placeholder', 'First Name'); //En este caso, se verifica que el campo tenga un placeholder con el texto 'First Name'
        await expect(checkoutInfoPage.getPlaceHolderLastName()).toHaveAttribute('placeholder', 'Last Name');
        await expect(checkoutInfoPage.getPlaceHolderPostalCode()).toHaveAttribute('placeholder', 'Zip/Postal Code');

      });

      test("Validate error message when checkout form is submitted empty", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
        
        // Validar si el botón "Continue" es visible antes de hacer clic
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible(); //antes de llenar todos los campos, debemos de validar que el botón esté visible, si lo pongo después de llenarlos me saldrá error.

        await checkoutInfoPage.checkoutCorrectInfo('', '', '');
       
        // Assertion:Validar Mensaje de error. 
        await expect(checkoutInfoPage.getErrorMsgMandatoryAllFields()).toHaveText('Error: First Name is required'); 
         
      });

      test("Show error message if first name is missing during checkout", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
        
        // Validar si el botón "Continue" es visible antes de hacer clic
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible(); //antes de llenar todos los campos, debemos de validar que el botón esté visible, si lo pongo después de llenarlos me saldrá error.

        await checkoutInfoPage.checkoutCorrectInfo('', 'Domínguez Diez', '456789001234');
       
        // Assertion:Validar Mensaje de error
        await expect(checkoutInfoPage.getErrorMsgMandatoryAllFields()).toHaveText('Error: First Name is required'); 
      });

      test("Show error message if last name is missing during checkout", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
        
        // Validar si el botón "Continue" es visible antes de hacer clic
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible(); //antes de llenar todos los campos, debemos de validar que el botón esté visible, si lo pongo después de llenarlos me saldrá error.

        await checkoutInfoPage.checkoutCorrectInfo('Luciana', '', '456789001234');
       
        // Assertion:Validar Mensaje de error.
        await expect(checkoutInfoPage.getErrorMsgMandatoryAllFields()).toHaveText('Error: Last Name is required'); 
      });

      test("Show error message if postal code is missing during checkout", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addRandomProductToCart();
        await inventoryPage.goToCart();

        const checkoutInfoPage = new CheckoutInformation(page);
        await checkoutInfoPage.accessToCheckoutInfoPage();
        
        // Validar si el botón "Continue" es visible antes de hacer clic
        await expect(checkoutInfoPage.getContinueButton()).toBeVisible(); //antes de llenar todos los campos, debemos de validar que el botón esté visible, si lo pongo después de llenarlos me saldrá error.

        await checkoutInfoPage.checkoutCorrectInfo('Luciana', 'Domínguez Diez', '');
       
        // Assertion:Validar Mensaje de error. 
        await expect(checkoutInfoPage.getErrorMsgMandatoryAllFields()).toHaveText('Error: Postal Code is required'); 
      });



    });
    