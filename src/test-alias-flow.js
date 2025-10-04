// Test script to verify alias flow implementation
import { aliasService } from './services/apiService';

// Mock token for testing
const mockToken = 'mock-token-for-testing';

// Mock localStorage for testing
const mockLocalStorage = {
    getItem: (key) => {
        if (key === 'access_token') return mockToken;
        return null;
    },
    setItem: (key, value) => {
        console.log(`Setting ${key}:`, value);
    }
};

// Mock fetch for testing
global.fetch = async (url, options) => {
    console.log(`Fetching: ${url}`);
    console.log('Options:', options);

    // Mock responses based on URL
    if (url.includes('/Auth/v2/me/status')) {
        return {
            ok: true,
            json: async () => ({
                piiCompleted: true,
                patientProfileCompleted: true,
                aliasIssued: false // Simulate user needs to select alias
            })
        };
    }

    if (url.includes('/v1/aliases/suggest')) {
        return {
            ok: true,
            json: async () => ({
                aliases: [
                    {
                        label: "Chó Sói Ban Mai #670",
                        reservationToken: "mock-token-1",
                        expiredAt: "2025-10-04T21:50:24.5754303+00:00"
                    },
                    {
                        label: "Hải Ly Hồn Nhiên #559",
                        reservationToken: "mock-token-2",
                        expiredAt: "2025-10-04T21:50:24.5754303+00:00"
                    }
                ],
                generatedAt: "2025-10-04T21:45:24.5754303+00:00"
            })
        };
    }

    if (url.includes('/v1/me/aliases/issue')) {
        return {
            ok: true,
            json: async () => ({
                success: true,
                message: "Alias issued successfully"
            })
        };
    }

    if (url.includes('/v1/me/alias')) {
        return {
            ok: true,
            json: async () => ({
                aliasId: "01e5b474-7a3f-4d3d-bd0d-f38c5f6a1f59",
                label: "Chó Sói Ban Mai #670",
                avatarUrl: "",
                followers: 0,
                followings: 0,
                posts: 0,
                createdAt: "2025-10-04T19:35:08.954872+00:00"
            })
        };
    }

    return {
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' })
    };
};

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

// Test the alias flow
async function testAliasFlow() {
    console.log('🧪 Testing Alias Flow...\n');

    try {
        // Step 1: Check alias status
        console.log('1. Checking alias status...');
        const status = await aliasService.checkAliasStatus();
        console.log('Status:', status);

        if (!status.aliasIssued) {
            // Step 2: Get alias suggestions
            console.log('\n2. Getting alias suggestions...');
            const suggestions = await aliasService.getAliasSuggestions();
            console.log('Suggestions:', suggestions);

            // Step 3: Select an alias
            console.log('\n3. Selecting alias...');
            const selectedAlias = suggestions.aliases[0];
            await aliasService.issueAlias(selectedAlias.label, selectedAlias.reservationToken);
            console.log('Alias issued successfully');

            // Step 4: Get current alias
            console.log('\n4. Getting current alias...');
            const currentAlias = await aliasService.getCurrentAlias();
            console.log('Current alias:', currentAlias);
        } else {
            // Step 2: Get current alias
            console.log('\n2. Getting current alias...');
            const currentAlias = await aliasService.getCurrentAlias();
            console.log('Current alias:', currentAlias);
        }

        console.log('\n✅ Alias flow test completed successfully!');
    } catch (error) {
        console.error('❌ Alias flow test failed:', error);
    }
}

// Run the test
testAliasFlow();
