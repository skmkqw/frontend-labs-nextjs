import { test as setup, expect } from "@playwright/test";
import path from "path";

import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const authFile = path.join(__dirname, "../playwright/.auth/user.json");
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const email = process.env.PLAYWRIGHT_USER_EMAIL;
const password = process.env.PLAYWRIGHT_USER_PASSWORD;

if (!email || !password) {
    throw new Error("PLAYWRIGHT_USER_EMAIL and PLAYWRIGHT_USER_PASSWORD must be set for auth setup.");
}

setup("authenticate", async ({ page }) => {
    await page.goto(`${baseURL}/user/signin`);
    await page.getByLabel("Adres e-mail").fill(email);
    await page.getByLabel("Hasło").fill(password);
    await page.getByRole("button", { name: "Zaloguj się" }).click();
    await page.waitForURL(`${baseURL}/`);
    await expect(page).toHaveURL(`${baseURL}/`);

    await page.context().storageState({ path: authFile });
});
