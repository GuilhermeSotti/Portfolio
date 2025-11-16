describe("Navegação básica do portfólio", () => {
  it("carrega a home e navega para um detalhe de projeto", () => {
    cy.visit("/");
    cy.contains("Projetos");
    // clica no primeiro botão 'Detalhes' (assume que há pelo menos 1)
    cy.get("a").contains("Detalhes").first().click({ force: true });
    cy.url().should("include", "/projects/");
    cy.get("h1").should("exist");
  });
});
