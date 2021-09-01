export const usernameField = () => cy.get("#username");
export const passwordField = () => cy.get("#password");
export const signInButton = () => cy.get("#sign-in");

export const attemptLogin = (username: string, password: string): void => {
	usernameField().type(username);
	passwordField().type(password);
	signInButton().click();
};