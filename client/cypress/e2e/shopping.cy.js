describe('Shopping Flow E2E Tests', () => {
  // We will intercept the login or setup a mock user. Often in Cypress, the best practice
  // is to log in programmatically to avoid repeating the UI login flow for every test file.
  beforeEach(() => {
    // Generate a unique user specifically for the shopping suite
    const testEmail = `shopper_${Date.now()}@example.com`;
    const testPassword = 'Password123!';

    // Register a new user via API call to ensure they exist
    cy.request({
      method: 'POST',
      url: '/api/auth/register',
      body: {
        name: 'Shopper Test',
        email: testEmail,
        password: testPassword,
        role: 'user'
      },
      failOnStatusCode: false // In case the email already exists in subsequent runs
    }).then(() => {
      // Login via API call to retrieve the JWT token
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: testEmail,
          password: testPassword
        }
      }).then((response) => {
        // Assert that the login was successful and we received the token
        expect(response.status).to.eq(200);
        const token = response.body.token;
        const user = response.body.user;

        // Populate localStorage with the authentication credentials
        // so the React AuthContext thinks the user is already logged in
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('user', JSON.stringify(user));
      });
    });
  });

  // Test 1: View the product catalog
  // Visits the products page and verifies that the grid of products is rendered.
  // It checks for the existence of product cards mapped out in the DOM.
  it('should display the product grid on the /products page', () => {
    cy.visit('/products');
    
    // Check that at least one product card (using the CSS class we set) is visible
    // We target the overarching glass-panel class used for the product cards
    cy.get('div.glass-panel').should('have.length.greaterThan', 0);
  });

  // Test 2: Filter products by category 
  // Interacts with the category dropdown / filter elements to select "Smartphone".
  // Asserts that the UI updates the URL and changes the DOM to reflect only that category.
  it('should filter the products when selecting the Smartphone category', () => {
    cy.visit('/products');
    
    // Select the 'Smartphone' option from the category dropdown
    cy.get('select').first().select('smartphone');

    // Wait for the UI update and URL reflection
    cy.url().should('include', 'category=smartphone');
    
    // Ensure that the products visible match the new criteria 
    // (i.e. 'smartphone' text should appear in the categorizations of the visible cards)
    cy.contains('smartphone', { matchCase: false }).should('be.visible');
  });

  // Test 3: Product Navigation
  // Clicks the specific detailed view button (labeled 'Details' in our Luxury UI)
  // on the very first product card. Asserts the URL correctly changes to a product ID layout.
  it('should navigate to the product details page when clicking View Details', () => {
    cy.visit('/products');
    
    // Find the first 'Details' link and click it
    cy.contains('a', 'Details').first().click();

    // Verify that the route shifted to the product detail view 
    // (Regex checks for the generic Mongo ID structure or product route)
    cy.url().should('match', /\/products\/[a-zA-Z0-9_-]+/);
    
    // Ensure the product detail page renders correctly by checking for the Back to Catalog button
    cy.contains('Back to Catalog').should('be.visible');
  });

  // Test 4: Add to Cart interaction
  // Goes to the product catalog, attempts to add the first available item to the cart,
  // and asserts that a toast/success message appears on the screen.
  it('should show a success message when adding a product to the cart (Reserve)', () => {
    cy.visit('/products');
    
    // Find the first 'Reserve' button and click it to add to cart
    cy.contains('button', 'Reserve').first().click();

    // Verify that the success toast message appears
    cy.contains('Added to reserve', { timeout: 5000 }).should('be.visible');
  });
});
