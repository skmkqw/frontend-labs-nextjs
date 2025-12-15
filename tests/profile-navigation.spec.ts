import { test, expect } from "@playwright/test";

test("użytkownik po zalogowaniu może przejść do profilu", async ({ page }) => {
    await page.goto("/user/profile");
    await page.waitForURL(/\/user\/profile/);
    await expect(page.locator("h1")).toContainText("Profil użytkownika");
});

test.describe("brak autoryzacji", () => {
    test.use({ storageState: undefined });

    test("niezalogowany użytkownik jest przekierowany do logowania", async ({ page }) => {
        await page.goto("/user/profile");
        await page.waitForURL(/\/user\/signin/);
        await expect(page.getByRole("heading", { name: /zaloguj się/i })).toBeVisible();
    });
});
