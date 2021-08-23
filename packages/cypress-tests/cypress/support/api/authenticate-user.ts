export const authenticateUser = (username: string, password: string) => {
	cy.request({
		method: "POST",
		url: `${Cypress.config().baseUrl}/api/user/login`,
		body: {
			username,
			password
		}
	}).then(response => {
		const token = response.body.token;
		cy.setCookie("auth_token", token);
	});
};