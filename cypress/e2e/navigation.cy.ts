describe("Navegação básica do portfólio", () => {
  it("carrega a home e navega para um detalhe de projeto", () => {
    cy.visit("/");
    cy.contains("Projetos");
    cy.get("a").contains("Detalhes").first().click({ force: true });
    cy.url().should("include", "/projects/");
    cy.get("h1").should("exist");
  });
});
