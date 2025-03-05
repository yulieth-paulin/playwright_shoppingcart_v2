import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';


test.describe("Login challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("https://www.saucedemo.com/");
    });

    test("login with a valid standard user", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
        //Assertion: The user logs in successfully and is redirected to the inventory page.
        await expect(loginPage.getProductTitle()).toHaveText('Products');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      });

      test("login with an incorrect password", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','pass#123');
        
        //Assertion: The system displays an error message.
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Epic sadface: Username and password do not match any user in this service');
      });

      test("login with an incorrect username", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard567','secret_sauce');
        
        //Assertion: The system displays an error message.
        const errorMessage = await loginPage.getErrorMessage(); //Aquí await garantiza que errorMessage sea un string, no una Promise<string>
        expect(errorMessage).toBe('Epic sadface: Username and password do not match any user in this service');
      });

      test("login with username only", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','');
        
        //Assertion: The system displays an error message.
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Epic sadface: Password is required');
      });

      test("login with password only", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','');
        
        //Assertion: The system displays an error message.
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Epic sadface: Password is required');
      });

      test("SQL Injection attempt", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials("' OR '1'='1'",'secret_sauce');
        
        //Assertion: The system displays an error message.
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Epic sadface: Username and password do not match any user in this service');
      });
    }); 

