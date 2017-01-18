![codefresh](./images/logo.png)

| pipeline name   | Last build status  |
|---|---|
|Build-first-image   | [![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=containers101&repoName=react-starter-kit&branch=codefresh&pipelineName=react-starter-kit&accountName=containers101&type=cf-2)]( https://g.codefresh.io/repositories/containers101/react-starter-kit/builds?filter=trigger:build;branch:codefresh;service:587f93d2bb28d1010059ed16~react-starter-kit)  |
|Build-codefresh-yml   | [![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=containers101&repoName=react-starter-kit&branch=codefresh&pipelineName=react-starter-kit&accountName=containers101&type=cf-2)]( https://g.codefresh.io/repositories/containers101/react-starter-kit/builds?filter=trigger:build;branch:codefresh;service:587f93d2bb28d1010059ed16~react-starter-kit)  |
###### Full credit for the application [react-starter-kit](https://github.com/kriasoft/react-starter-kit)

## Setup your first service using [Codefresh](https://codefresh.io/).

### Step-by-step tutorial:
#### 1. Fork this repo.
![codefresh](./images/fork.png)
#### 2. Login into codefresh using your github account.
![codefresh](./images/signup.png)
#### 3. Add your first service and build it.
![codefresh](./images/add.png)

![codefresh](./images/next.png)

![codefresh](./images/select.png)

![codefresh](./images/dockerfile.png)

![codefresh](./images/review.png)

![codefresh](./images/build.png)
#### 4. Wait until the build is done.

![codefresh](./images/building.png)

![codefresh](./images/build-done.png)

#### 5. Open images and click 'lunch'.

![codefresh](./images/images.png)

![codefresh](./images/launch.png)

#### 5. VOILÀ   ![codefresh](./images/superfresh.png)


### Start using codefresh.yml
#### Using codefresh.yml you can customize your pipeline
Now when your first service is setup and your first pipeline produced an image, lets move forward and push the image to Dockerhub registry.
We at Codefresh already build for you the basic `codefresh.yml` template, use it.
- Click on your service `react-starter-kit`.
- Switch to `Use YML build`.
- Under Environment variables fill your Dockerhub credentials to be.
  - `DOCKER_USER_NANE` your Dockerhub user name
  - `DOCKER_PASSWORD` your Dockerhub password
- Dont forget to encrypt them!
- Save your updated pipeline
- Build and launch
