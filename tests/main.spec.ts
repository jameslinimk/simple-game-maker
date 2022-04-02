import { expect, test } from "@playwright/test"

test("test test", async ({ page }) => {
	await page.goto("https://playwright.dev/")
	const title = page.locator(".navbar__inner .navbar__title")
	await expect(title).toHaveText("Playwright")
})
