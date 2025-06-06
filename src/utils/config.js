export const DATING_CONFIG = {
    appID: 1162978115,
    serverSecret: "ydafab4fd35b48236780474833d2543ec"
};

export function generateUserToken(userID) {

    // Development tokens for testing
    // In production, generate these securely on your backend

    const testTokens = {
        "alexandra_model": "04AAAAAGhERYoADFpAahlQzaIB3BfOhQC6Vh5HrLlCeQCyr6TEK0aGXa9SY6Tn4m0D9dITYP4vabYvOEeYf56xOY+6WU+Fbb3T3kS1muDPS1tQiuUkswnGhNi2YpYbIz3OW9rQB0Km18Q7dGeGtB7qQHNDAE+8FCOso3u9OQymKx9Zm+oAtDATRDpBJnvNXfCtuZRI/XIz9j5k6YxM9jg1ijWF38IvTokn+az+suqtuTBw3PlNQlKKgwhl/3SZZm7A1jlPia4kOGZ4ajujYikhzoa5AQ==",
        "james_actor": "04AAAAAGhERagADD+8Gk44ASCUkUmNCwC1yZ0hVsz5z66a6LTxBCuC+2RXfnbXM1f72wfmiLJV9KU0/PP45cEs34Hqwd2l66ylEtE8hlSCcprAKizYBW5sOOa8Uh2bEdx2ZysbZ4jOUjYE/Yx3UfmH4spx3SqxuvnN61XRGXh6WRSSm0G+OMeSqdxeOiVd6hyBzcAt/zoN+gPF7EZkk9PVbDx1luX2CrhPXft/SddzxwXHKNPlZZdBqmkS4VaHDRNhFlNW1y/INAhkC6hXzQE=",
        "sophia_artist": "04AAAAAGhERcUADAIWf9cqLtlBltZoTwC3OmEERlBqvv+SnkKYOHUPtYbl/nEPel/tCVZix5yE8KX5UbZcjqtrUlAXL2eEdq+kz3VwAHOAbcd/QLZECnvwuN1Wcopi4UKJEZN7NbikZlYAFILttCX49WXHryK76gkh/Y+YrtQiRgrEMztByVcDzSngM+tZZazeFa/UAGQvSjPJhWWHwvgpVNcptL7An8Tb7+i11iFdR3KrxaIW4z/pz3PZOld2jvs2q79/UGE6WMNxFEYOt27JAQ=="
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