context("Zeal login page", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	describe("When opening the login page", () => {
		it("Should render the login form", () => {
			cy.get("#username").should("exist");
			cy.get("#password").should("exist");
			cy.get("#sign-in").should("exist");
		});
	});
});