describe('Authentication E2E Tests', () => {
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';
  const name = 'Cypress User';

  // Test 1: Register a new user
  // This test visits the registration page, fills out the form with a dynamic unique email,
  // submits it, and verifies that the application redirects the user successfully 
  // to the Profile or Products page, which indicates a successful registration.
  it('should register a new user and redirect to the application', () => {
    cy.visit('/register');
    
    // Fill in the registration form
    cy.get('input[type="text"]').type(name);
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').type(password);
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify successful redirect to the profile or products page
    // The previous implementation sends them to /profile
    cy.url().should('match', /\/(profile|products)$/);
  });

  // Test 2: Login an existing user
  // This test uses the same credentials generated in the registration test, visits the login page,
  // fills the credentials, and submits. It then checks the DOM to ensure that the Navbar is updated
  // to show the "Sign Out" button, which indicates the authentication state is active.
  it('should login an existing user and display the Navbar with logout', () => {
    cy.visit('/login');
    
    // Use the recently registered credentials
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').type(password);
    
    // Submit login
    cy.get('button[type="submit"]').click();
    
    // Wait for the redirect or state change
    cy.url().should('not.include', '/login');
    
    // Verify the Navbar shows the logout button instead of Sign In / Get Started
    cy.contains('nav', 'Sign Out').should('be.visible');
  });

  // Test 3: Protected route redirection
  // This test clears the application storage (simulating a logged-out user), and tries to visit
  // a protected route (/cart). It asserts that the application correctly intercepts the request
  // and redirects the unauthenticated user back to the /login page.
  it('should redirect an unauthenticated user attempting to visit /cart to /login', () => {
    // Clear cookies/local storage to ensure the user is not authenticated
    cy.clearLocalStorage();
    cy.clearCookies();

    // Attempt to visit a protected route
    cy.visit('/cart');
    
    // The application should enforce the ProtectedRoute and redirect to login
    cy.url().should('include', '/login');
  });
});
