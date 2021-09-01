import { authenticateUser } from "../../support/api/authenticate-user";
import * as validUser from "../../fixtures/valid-user.json";
import * as userWithLicense from "../../fixtures/user-with-license.json";
import { noLicensePromptShouldExist } from "../../support/assertions/dashboard/no-license";

context("Jobs page", () => {
	beforeEach(() => {
		authenticateUser(validUser.username, validUser.password);
	});

	context("User with valid license", () => {
		beforeEach(() => {
			cy.intercept("GET", "**/user/me", { body: userWithLicense }).as("getUserInfo");
			cy.visit("/dashboard/jobs");
			cy.wait("@getUserInfo");
		});
		describe("When clicking on new job", () => {
			it("Should show the form to create a job", () => {
				cy.get("#new-job").click();
				cy.get("#create-job").should("be.visible").should("be.disabled");
			});
		});
	});

	context("User without license", () => {
		beforeEach(() => {
			cy.intercept("GET", "**/user/me", { fixture: "user-without-license.json" }).as("getUserInfo");
			cy.visit("/dashboard/jobs");
			cy.wait("@getUserInfo");
		});
		describe("When clicking on new job", () => {
			it("Should prompt the user to purchase/redeem a license", () => {
				cy.get("#new-job").click();
				noLicensePromptShouldExist();
			});
		});
	});
});