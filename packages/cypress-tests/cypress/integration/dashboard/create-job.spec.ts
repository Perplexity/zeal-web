import { authenticateUser } from "../../support/api/authenticate-user";
import * as validUser from "../../fixtures/valid-user.json";
import * as userWithLicense from "../../fixtures/user-with-license.json";
import "cypress-file-upload";

const uploadFile = (fileName: string, content: string, mime: string) => {
	cy.get("#uploader").attachFile({
		fileContent: new Blob([content]),
		fileName: fileName,
		mimeType: mime,
	});
};

context("Create a job", () => {
	beforeEach(() => {
		cy.intercept("GET", "**/user/me", { body: userWithLicense }).as("getUserInfo");
		authenticateUser(validUser.username, validUser.password);
		cy.visit("/dashboard/jobs");
		cy.wait("@getUserInfo");
	});

	context("When uploading an invalid format file", () => {
		it("Should display an error", () => {
			cy.get("#new-job").click();
			uploadFile("invalid.exe", "invalid format", "application/octet-stream");
			cy.get(".MuiAlert-message").should("contain.text", "Invalid file format. Must be '.txt'");
		});
	});

	context("When uploading a valid file format but no valid combos inside", () => {
		it("Should display an error", () => {
			cy.get("#new-job").click();
			uploadFile("combos.txt", "Not a combo", "text/plain");
			cy.get(".MuiAlert-message").should("contain.text", "No valid combos were found in this file");
		});
	});

	context("When more combos than a license allows", () => {
		it("Should display an error message", () => {
			cy.get("#new-job").click();
			cy.fixture("200-combos.txt").then((content) => {
				uploadFile("combos.txt", content, "text/plain");
				cy.get(".MuiAlert-message").should("contain.text", `Cannot load 200 combos, your limit is ${userWithLicense.license.combo_limit} per job.`);
			});
		});
	});

	context("When uploading 100 valid combos", () => {
		it("Should display a success message", () => {
			cy.get("#new-job").click();
			cy.fixture("100-combos.txt").then((content) => {
				uploadFile("combos.txt", content, "text/plain");
				cy.get(".MuiAlert-message").should("contain.text", "Successfully loaded 100 combos");
			});
		});
	});
});