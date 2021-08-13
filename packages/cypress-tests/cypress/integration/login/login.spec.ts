import { attemptLogin, passwordField, signInButton, usernameField } from "../../support/actions/login/attempt-login";


context("Zeal login page", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	describe("When opening the login page", () => {
		it("Should render the login form", () => {
			usernameField().should("exist");
			passwordField().should("exist");
			signInButton().should("exist");
		});
	});

	describe("When submitting a valid login", () => {
		it("Should take us to the dashboard page", () => {
			attemptLogin("test", "test");
			cy.url().should("contain", "dashboard/home");
		});
	});

	describe("When submitting an invalid login", () => {
		it("Should display an error", () => {
			attemptLogin("test", "wrongpassword");
			cy.get(".MuiAlert-message").should("contain.text", "Invalid username/password");
		});
	});
});