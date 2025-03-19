import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';



test.describe("Login challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/'); //Navega directo a la BASEURL del ambiente cargado.
    });

    test("login with a valid standard user", async ({ page }) => {
        const loginPage = new LoginPage(page); //Instancia
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
        //Assertion: The user logs in successfully and is redirected to the inventory page.
        await expect(loginPage.getProductTitle()).toHaveText('Products');
        await expect(page).toHaveURL('/inventory.html'); // Validación de la página correcta
      });

      test("login with an incorrect password", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','pass#123');
        
        //Assertion: The system displays an error message.
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username and password do not match any user in this service');
      });

      test("login with an incorrect username", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard567','secret_sauce');
        
        //Assertion: The system displays an error message.
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username and password do not match any user in this service')
      });

      test("login with username only", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','');
        
        //Assertion: The system displays an error message
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Password is required');
      });

      test("login with password only", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','');
        
        //Assertion: The system displays an error message.
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Password is required');
      });

      test("SQL Injection attempt", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials("' OR '1'='1'",'secret_sauce');
        
        //Assertion: The system displays an error message.
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username and password do not match any user in this service');
      });
    }); 

