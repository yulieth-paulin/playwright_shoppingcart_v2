import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/login';



test.describe("Login challenge", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/'); 
    });

    test("login with a valid standard user", async ({ page }) => {
        const loginPage = new LoginPage(page); 
        await loginPage.loginCorrectCredentials('standard_user','secret_sauce');
        
        
        await expect(loginPage.getProductTitle()).toHaveText('Products');
        await expect(page).toHaveURL('/inventory.html'); // Validación de la página correcta
      });

      test("login with an incorrect password", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','pass#123');
        
        
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username and password do not match any user in this service');
      });

      test("login with an incorrect username", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard567','secret_sauce');
        
        
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username and password do not match any user in this service')
      });

      test("login with username only", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','');
        
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Password is required');
      });

      test("login with password only", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('standard_user','');
        
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Password is required');
      });

      test("login with locked user in the page", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials('locked_out_user','secret_sauce');
        
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Sorry, this user has been locked out.');
      });

      test("SQL Injection attempt", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials("' OR '1'='1'",'secret_sauce');
        
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username and password do not match any user in this service');
      });

      test("SQL2 Injection attempt", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginCorrectCredentials("' OR '1'='1'",'secret_sauce');
        
        await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username and password do not match any user in this service');
      });
    }); 

