import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visit("/");
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /did you work today?/i }).click();
    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /log in/i });
  });

  it("should allow you to toggle today's day off", () => {
    cy.login();
    cy.visit("/");

    cy.findByRole("link", { name: /did you work today?/i }).click();
    cy.findByText("Did you work today?");

    cy.findByRole("radio", { name: /no/i, checked: false }).click();
    cy.findByText("🏝");
    cy.findByRole("radio", { name: /yes/i, checked: false }).click();
    cy.findByText("👩‍💻");
  });
});
