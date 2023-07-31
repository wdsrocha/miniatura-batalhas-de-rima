describe("Navigation", () => {
  it("should be able to visit all pages", () => {
    cy.visit("/");

    cy.get('[href="/editor"]').contains("Comece a editar").click();
    cy.get("label").contains("Escolha uma imagem para começar");

    cy.get('nav [href="/sobre"]').click();
    cy.get("h1").contains("Miniatura de Vídeo para Batalhas de Rima");

    cy.get('nav [href="/colabore"]').click();
    cy.get("h1").contains("Fala comigo");

    // Go back to home
    cy.get('nav [href="/"]').click();
    cy.get("h1").contains("Miniaturas de Batalha");

    cy.get('[href="/sobre"').contains("Saiba mais").click();
    cy.get("h1").contains("Miniatura de Vídeo para Batalhas de Rima");
  });
});

describe("Editor page", () => {
  beforeEach(() => {
    cy.visit("/editor");

    cy.get("label").selectFile("cypress/fixtures/sample-image.jpeg");
    cy.get("[data-test=crop-modal] button").click();
  });

  // This was a regression
  it("should re-upload same image", () => {
    cy.contains("sample-image.jpeg").should("exist");
    cy.contains("Trocar imagem").selectFile(
      "cypress/fixtures/sample-image.jpeg"
    );
    cy.get("[data-test=crop-modal] button").click();
    cy.contains("sample-image.jpeg").should("exist");
  });

  it("should change all form fields and save the final image", () => {
    cy.get("#title").type("fulano x ciclano");

    // Can't use .check(value) because headless ui don't use native radio role
    cy.contains("headliner").click();

    // Select yellow
    cy.get("[data-test=color-options]")
      .children()
      .first()
      .next()
      .next()
      .click();

    cy.get("[data-test=color-options]").children().last().prev().click();

    cy.get("#customColorPicker").type("#d035db");
    cy.contains("Close panel").click();

    cy.get("button").contains("Salvar imagem").click();

    cy.contains("Pronto!").should("exist");
    cy.contains("Sua miniatura foi salva com sucesso.").should("exist");

    cy.verifyDownload("fulano-x-ciclano.png");
  });
});
