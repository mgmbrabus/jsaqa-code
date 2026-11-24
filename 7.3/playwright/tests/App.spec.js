const { test, expect } = require("@playwright/test");
const { email, password } = require("../user");

test.setTimeout(90000);

test("Успешная авторизация", async ({ page }) => {
  await page.goto("https://netology.ru/?modal=sign_in");
  await page.getByText("Другие способы входа").click();
  await page.getByText("Войти по почте").click();

  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Пароль").fill(password);
  await page.getByTestId("login-submit-btn").click();

  await expect(page).toHaveURL(/https:\/\/netology\.ru\/profile/, { timeout: 60000 });
  await expect(
    page.getByRole("heading", { name: "Здравствуйте", level: 2 })
  ).toBeVisible({ timeout: 30000 });
});

test("Неуспешная авторизация", async ({ page }) => {
  await page.goto("https://netology.ru/?modal=sign_in");
  await page.getByText("Другие способы входа").click();
  await page.getByText("Войти по почте").click();

  await page.getByPlaceholder("Email").fill("invalid_email@example.com");
  await page.getByPlaceholder("Пароль").fill("invalid_password123");
  await page.getByTestId("login-submit-btn").click();

  const errorHint = page.getByTestId("login-error-hint");
  await expect(errorHint).toBeVisible({ timeout: 60000 });
  await expect(errorHint).toHaveText("Вы ввели неправильно логин или пароль.");
});