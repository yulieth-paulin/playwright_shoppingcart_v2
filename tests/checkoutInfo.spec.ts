import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';
import { InventoryPage } from '../src/inventory';
import { expectedProductNames } from '../data/productsData';
import { CheckoutInformation } from '../src/checkoutInfo';
import exp from 'constants';


test.describe("Inventory challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("https://www.saucedemo.com/");
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

      test("Submit checkout form with all fields empty", async ({ page }) => {
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
        const errorMsg = await checkoutInfoPage.getErrorMsgMandatoryAllFields(); 
        expect(errorMsg).toContain('First Name is required'); //es más flexible, ya que solo verifica que el texto contiene la parte relevante del mensaje, sin importar si hay otras palabras antes o después.
        //await expect(checkoutInfoPage.getErrorMsgMandatoryFields()).toHaveText('Error: First Name is required') se usa en caso de que en el método lo llame por el Locator. 
      });

      test("Checkout without first name", async ({ page }) => {
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
       
        // Assertion:Validar Mensaje de error. 
        const errorMsg = await checkoutInfoPage.getErrorMsgMandatoryAllFields(); 
        expect(errorMsg).toContain('Error: First Name is required'); 
      });

      test("Checkout without last name", async ({ page }) => {
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
        const errorMsg = await checkoutInfoPage.getErrorMsgMandatoryAllFields(); 
        expect(errorMsg).toContain('Error: Last Name is required'); 
      });

      test("Checkout without postal code", async ({ page }) => {
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
        const errorMsg = await checkoutInfoPage.getErrorMsgMandatoryAllFields(); 
        expect(errorMsg).toContain('Error: Postal Code is required'); 
      });



    });
    