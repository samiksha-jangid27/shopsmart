describe('ShopSmart End-to-End User Flow', () => {
  it('should successfully load the homepage, verify API integration, and see products', () => {
    // We are mocking the API response purely for the E2E test reliability
    cy.intercept('GET', '/api/stats', {
      statusCode: 200,
      body: { orders: 99, period: 'Cypress Test' }
    }).as('getStats');

    cy.visit('http://localhost:5173'); // Assuming default vite port

    // Verify UI Structure
    cy.contains('ShopSmart').should('be.visible');
    cy.contains('Explore').should('be.visible');
    
    // Verify API data loaded into the top banner
    cy.wait('@getStats');
    cy.contains('99').should('be.visible');
    cy.contains('Cypress Test').should('be.visible');

    // Verify key products are visible
    cy.contains('Zebra sandal').should('be.visible');
  });
});
