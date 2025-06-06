export const DATING_CONFIG = {
    appID: your_app_id,
    serverSecret: "your_server_secret"
};

export function generateUserToken(userID) {

    // Development tokens for testing
    // In production, generate these securely on your backend

    const testTokens = {
        "alexandra_model": "development_token_here",
        "james_actor": "development_token_here",
        "sophia_artist": "development_token_here"
    };
        
    return testTokens[userID] || "";
}

export const DEMO_PROFILES = [
    {
        userID: "alexandra_model",
        name: "Alexandra",
        age: 28,
        profession: "Fashion Model",
        location: "Los Angeles, CA",
        photos: [
            "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&h=600&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face"
        ],
        interests: ["Photography", "Travel", "Yoga"],
        verified: true
    },
    {
        userID: "james_actor",
        name: "James",
        age: 32,
        profession: "Film Actor",
        location: "New York, NY", 
        photos: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"
        ],
        interests: ["Theater", "Fitness", "Cooking"],
        verified: true
    },
    {
        userID: "sophia_artist",
        name: "Sophia",
        age: 26,
        profession: "Digital Artist",
        location: "Miami, FL",
        photos: [
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face"
        ],
        interests: ["Art", "Music", "Dancing"],
        verified: true
    }
];