/// <reference types="cypress" />

describe('home page', () => {
  it('renders the title and description', () => {
    cy.visit('/');
    cy.get('[data-cy=app-title]').should('have.text', 'Forum MSE 2026');
    cy.get('[data-cy=app-description]').should('contain', 'CI/CD teaching frontend');
    cy.get('[data-cy=check-status]').should('be.visible');
    cy.get('[data-cy=status-label]').should('contain', 'not checked yet');
  });
});
