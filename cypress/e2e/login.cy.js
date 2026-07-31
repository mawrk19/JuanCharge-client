describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('/login')
    })

    it('should display the login form with correct elements', () => {
        // Check for main heading (Brand text)
        cy.contains('JuanCharge').should('be.visible')
        cy.contains('Powering Every Juan.').should('be.visible')

        // Check for input fields
        cy.get('input[type="email"]').should('exist')
        cy.get('input[type="password"]').should('exist')

        // Check for Sign In button
        // Quasar q-btn renders a button element or a div with role button depending on props
        // We look for the text content
        cy.contains('Sign In').should('be.visible')

        // Check for links
        cy.contains('Forgot Password?').should('be.visible')
        // Create Account is commented out in code, so we should NOT verify it
    })

    it('should show validation error or stay on page for empty submission', () => {
        // Click submit without entering data
        cy.contains('Sign In').click()

        // Should still be on login page
        cy.url().should('include', '/login')
    })

    it('should show error notification on invalid credentials', () => {
        // Enter invalid credentials
        cy.get('input[type="email"]').type('invaliduser@example.com')
        cy.get('input[type="password"]').type('wrongpassword123')

        // Submit form
        cy.contains('Sign In').click()

        // Check for notification
        // Quasar notifications are appended to the body
        cy.get('.q-notification').should('be.visible')
    })
})
