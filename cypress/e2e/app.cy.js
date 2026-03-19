describe("ShopSmart E2E Test", () => {
  it("loads homepage and checks UI", () => {
    cy.visit("http://localhost:5173");

    cy.contains("Shop");
    cy.contains("Explore");
    cy.contains("Cart");

    cy.get("button").contains("Cart").click();
  });
});