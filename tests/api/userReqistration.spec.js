import { test, expect } from '@playwright/test';

test.describe('Registration API Tests', () => {
    test('TC#API#1: New user registration (all data is correct)', async ({ request }) => { });

    test('TC#API#2: New user registration with an existing email address', async ({ request }) => { });

    test('TC#API#3: Registering a new user with an existing username', async ({ request }) => { });
    
    test('TC#API#4: New user registration without entering a password', async ({ request }) => { });
});
