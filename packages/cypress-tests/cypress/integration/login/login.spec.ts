context("Zeal login page", () => {
	beforeEach(() => {
		cy.setCookie("x-cypress-test", "true");
		cy.visit("/");
	});

	describe("When opening the login page", () => {
		it("Should render the login form", () => {
			cy.get("#username").should("exist");
			cy.get("#password").should("exist");
		});
	});
});