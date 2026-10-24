import { expect, test } from "@playwright/test";
import { samples } from "../lib/samples";

test("a description becomes a resume and a letter you can read", async ({ page }) => {
  const ai = samples.find((item) => item.id === "ai")!;
  await page.goto("/studio");
  await expect(page.getByRole("heading", { name: "Make the documents" })).toBeVisible();
  await page.getByLabel("Job description").fill(ai.jd);
  await page.getByLabel("Company").fill(ai.company);
  await page.getByLabel("Role").fill(ai.role);
  await expect(page.getByText(/Myriox stays/)).toBeVisible();
  await page.getByRole("button", { name: "Make the documents" }).click();
  await expect(page.getByRole("button", { name: "Resume PDF" })).toBeVisible({ timeout: 120_000 });
  await expect(page.getByRole("heading", { name: "Aryan Jaiswal" })).toBeVisible();
  await expect(page.getByText("Myriox").first()).toBeVisible();
  await page.getByRole("button", { name: "Read the letter" }).click();
  await expect(page.getByText(/would make me a valuable asset/)).toBeVisible();
  await expect(page.getByText(/Dear Northstar Hiring Team/)).toBeVisible();

  await page.goto("/log");
  await expect(page.getByText("Northstar — AI Engineer").first()).toBeVisible();
  await expect(page.getByText(/Fit [1-5] of 5/).first()).toBeVisible();

  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
  await expect(page.getByText(/Wedding Home replaces it/)).toBeVisible();
});

test("a product description selects The Wedding Home before any PDF", async ({ page }) => {
  const sample = samples.find((item) => item.id === "fullstack")!;
  await page.goto("/studio");
  await page.getByLabel("Job description").fill(sample.jd);
  await page.getByLabel("Role").fill(sample.role);
  await expect(page.getByText(/Wedding Home replaces Myriox/)).toBeVisible();
  await expect(page.getByText("22 original music pieces").first()).toBeVisible();
});

test("a senior posting shows the blocker and still allows the documents", async ({ page }) => {
  const sample = samples.find((item) => item.id === "staff")!;
  await page.goto("/studio");
  await page.getByLabel("Job description").fill(sample.jd);
  await page.getByLabel("Role").fill(sample.role);
  await expect(page.getByText(/5 or more years/)).toBeVisible();
  await expect(page.getByText(/Left out, because they are not in your profile: Kafka/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Make the documents" })).toBeEnabled();
});
