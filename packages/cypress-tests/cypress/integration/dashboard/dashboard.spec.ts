import { authenticateUser } from "../../support/api/authenticate-user";
import * as validUser from "../../fixtures/valid-user.json";
import * as userWithLicense from "../../fixtures/user-with-license.json";
import { noLicensePromptShouldExist } from "../../support/assertions/dashboard/no-license";

const licenseCard = () => cy.get("#license-card");

context("Zeal dashboard", () => {
	beforeEach(() => {
		authenticateUser(validUser.username, validUser.password);
		cy.visit("/dashboard/home");
	});

	context("User with valid license", () => {
		beforeEach(() => {
			cy.intercept("GET", "**/user/me", { body: userWithLicense });
		});
		describe("When the dashboard has been loaded", () => {
			it("Should display their license information", () => {
				licenseCard().should("contain.text", `Tier: ${userWithLicense.license.name}`);
				licenseCard().should("contain.text", `Job Limit: ${userWithLicense.license.job_limit}`);
				licenseCard().should("contain.text", `Thread Limit: ${userWithLicense.license.thread_limit}`);
				licenseCard().should("contain.text", `Combo Limit: ${Number(userWithLicense.license.combo_limit).toLocaleString()}`);
			});
		});
	});

	context("User without license", () => {
		beforeEach(() => {
			cy.intercept("GET", "**/user/me", { fixture: "user-without-license.json" });
		});
		describe("When the dashboard has been loaded", () => {
			it("Should prompt the user to purchase/redeem a license", () => {
				noLicensePromptShouldExist();
			});
		});
	});
});