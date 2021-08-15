const noLicensePrompt = () => cy.get("#no-license-container");
export const noLicenseBoxShouldExist = () => {
	noLicensePrompt().should("exist").should("contain.text", "You do not currently have an active license.");
	cy.get("#purchase-license").should("be.visible");
	cy.get("#redeem-license").should("be.visible");
};