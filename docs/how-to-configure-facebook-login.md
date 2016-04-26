## How to configure Facebook Login

This is rough, PRs are welcome. [Check Contributing.md](../CONTRIBUTING.md)

1. Navigate and Login to https://developers.facebook.com/apps
2. ![alt text](http://goldplugins.com/wp-content/uploads/2013/07/ss11.png "")
 (C) by https://goldplugins.com
3. Chose "Website" as your Platform
4. Go through the process of getting a App ID.
5. Go to your [Apps Center](developers.facebook.com/apps) and then to Settings.
6. ![alt text](http://i.imgur.com/qJCY1w5.png "")
7. Set the site URL (*not*) the domain to `https://localhost:3000` (Port of your Node server, not the port of the BrowserSync proxy)
8. Get your App ID and Secret and copy it to [`src/config.js`](../src/config.js)
