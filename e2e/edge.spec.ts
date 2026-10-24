import { expect, test } from "@playwright/test";

test("home, health, and a disabled button on a short description", async ({ page, request }) => {
  const health = await request.get("/api/health");
  expect(health.ok()).toBeTruthy();
  expect(await health.json()).toEqual({ ok: true, service: "desk" });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Desk" })).toBeVisible();
  await page.getByRole("link", { name: "Tailor", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Make the documents" })).toBeVisible();
  await page.getByLabel("Job description").fill("too short");
  await expect(page.getByRole("button", { name: "Make the documents" })).toBeDisabled();
});

test("pinning two projects survives a hostile company name", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: /The Wedding Home/ }).click();
  await page.getByRole("button", { name: /^Null/ }).click();
  await expect(page.getByText("Slot 1: The Wedding Home")).toBeVisible();
  await expect(page.getByText("Slot 2: Null")).toBeVisible();

  await page.goto("/studio");
  await page.getByLabel("Job description").fill(
    "Northstar wants an AI Engineer in Bengaluru, hybrid. Retrieval, agents, Python, and Azure. Full-time.",
  );
  await page.getByLabel("Company").fill("AT&T <script>");
  await page.getByLabel("Role").fill("AI Engineer");
  await expect(page.getByText(/You pinned these two projects/)).toBeVisible();
  await page.getByRole("button", { name: "Make the documents" }).click();
  await expect(page.getByRole("button", { name: "Resume PDF" })).toBeVisible({ timeout: 120_000 });
  await expect(page.getByText("The Wedding Home").first()).toBeVisible();
  await page.getByRole("button", { name: "Read the letter" }).click();
  await expect(page.getByText(/Dear AT&T/)).toBeVisible();
  await expect(page.getByText(/would make me a valuable asset/)).toBeVisible();
});

test("generate rejects a short description", async ({ request }) => {
  const response = await request.post("/api/generate", {
    data: { jd: "short", company: "X", role: "AI Engineer", wantResume: true, wantCover: true },
  });
  expect(response.status()).toBe(400);
});

test("generate rejects a request for neither document", async ({ request }) => {
  const response = await request.post("/api/generate", {
    data: {
      jd: "Northstar wants an AI Engineer using Python, Azure, RAG, and agents in Bengaluru. Full-time hybrid.",
      company: "Northstar",
      role: "AI Engineer",
      wantResume: false,
      wantCover: false,
    },
  });
  expect(response.status()).toBe(400);
});
