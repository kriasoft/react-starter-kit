TODO: write docs based on new bamboo config

# Build and deploy, manual to Azure

Make sure the git build repository is hooked up to the Azure environments.
Check your package.json and look for

```
  "deploymentRepository": "https://vcs.lostboys.nl/SOME_REPO.git",
```

Run deploy to specific branch (test)

```bash
DEPLOY_BRANCH=test yarn deploy
```

---

# Build and deploy, automated setup

## 1. Bamboo

### 1.1 Run yarn to install packages

```bash
yarn
```

### 1.2 Run build to build FE (the build will clean the build folder itself)

#### 1.2.1 Dev and Test builds

```bash
yarn build
```

#### 1.2.2 For staging and production builds

```bash
yarn build --release
```

### 1.3 Copy `build` folder (located in root) to Azure Environment

## 2 Azure enviornment

### 2.1 Run the following commands.

```bash
npm install --production --no-progress
npm start
```
