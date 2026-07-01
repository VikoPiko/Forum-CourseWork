/// <reference types="cypress" />

describe('backend status panel', () => {
  it('shows "reachable" when health returns UP (intercepted)', () => {
    cy.intercept('GET', '/api/actuator/health', {
      statusCode: 200,
      body: { status: 'UP' },
    }).as('health');

    cy.visit('/');
    cy.get('[data-cy=check-status]').click();
    cy.wait('@health');
    cy.get('[data-cy=status-label]').should('contain', 'Backend is reachable');
  });

  it('shows "unavailable" when the backend errors (intercepted)', () => {
    cy.intercept('GET', '/api/actuator/health', { forceNetworkError: true }).as('healthDown');

    cy.visit('/');
    cy.get('[data-cy=check-status]').click();
    cy.wait('@healthDown');
    cy.get('[data-cy=status-label]').should('contain', 'Backend is unavailable');
  });

  it('shows "unknown" when health responds with a non-UP status', () => {
    cy.intercept('GET', '/api/actuator/health', {
      statusCode: 200,
      body: { status: 'OUT_OF_SERVICE' },
    }).as('healthDegraded');

    cy.visit('/');
    cy.get('[data-cy=check-status]').click();
    cy.wait('@healthDegraded');
    cy.get('[data-cy=status-label]').should('contain', 'Backend status unknown');
  });

  it('renders posts returned from the read-only endpoint', () => {
    cy.intercept('GET', '/api/posts', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Welcome', content: 'hello', createdAt: '2026-01-01T00:00:00Z' },
        { id: 2, title: 'CI/CD', content: 'fun', createdAt: '2026-01-02T00:00:00Z' },
      ],
    }).as('posts');

    cy.visit('/');
    cy.get('[data-cy=load-posts]').click();
    cy.wait('@posts');
    cy.get('[data-cy=posts-list] li').should('have.length', 2);
    cy.get('[data-cy=posts-list]').should('contain', 'Welcome').and('contain', 'CI/CD');
  });
});
