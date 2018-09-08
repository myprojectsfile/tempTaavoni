export default {
    "Routes": [
        {
            "routeUrl": "/",
            "signInRequired": "false",
            "claims": []
        },
        {
            "routeUrl": "/profile",
            "signInRequired": "true",
            "claims": []
        },
        {
            "routeUrl": "/queue",
            "signInRequired": "true",
            "claims": ["shareholder"]
        },
        {
            "routeUrl": "/requests",
            "signInRequired": "true",
            "claims": ["shareholder"]
        },
        {
            "routeUrl": "/trades",
            "signInRequired": "true",
            "claims": ["tradeAdmin"]
        },
        {
            "routeUrl": "/portfo",
            "signInRequired": "true",
            "claims": ["shareholder"]
        },
        {
            "routeUrl": "/useradmin",
            "signInRequired": "true",
            "claims": ["userAdmin"]
        }
    ]
}