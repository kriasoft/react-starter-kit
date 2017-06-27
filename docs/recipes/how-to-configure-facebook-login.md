How to configure Facebook Login

1. Navigate and Login to https://developers.facebook.com/apps
2. Click "Add New App"
3. Enter your app name and contact email
4. In App Dashboard, click `Set Up` in Facebook Login section
5. Chose "Web" as your Platform
6. Set Site URL to `http://localhost:3000/` for local testing. (Port of your Node server, not the port of the BrowserSync proxy)
7. Click Facebook Login on the left panel
8. Turn on Client OAuth Login and Web OAuth Login. Enter `http://localhost:3001/login/facebook/return` for Valid OAuth redirect URIs.
9. Get your App ID and Secret and copy it to [`src/config.js`](../src/config.js)
