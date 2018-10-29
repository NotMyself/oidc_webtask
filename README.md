# OIDC Webtask

![Auth0 Wisdom](/docs/images/auth0-wisdom-demo.gif?raw=true "Auth0 Wisdom")

A Sample webtask project that uses Auth0's OIDC Provider for authentication.

[Demo](https://wt-3f533296d128037c9af8381221f78dd6-0.sandbox.auth0-extend.com/oidc-client/) - Give it a try.

## Getting Started

### Prepping the Environment
1. Install [Node v8.2.1 or Above](https://nodejs.org/en/).
2. Install [Visual Studio Code](https://code.visualstudio.com/), the [Insiders Edition](https://code.visualstudio.com/insiders) is highly recommended.
3. Install the [WT-CLI](https://www.npmjs.com/package/wt-cli).
  - You will need to initalize the cli, `wt init`.

### Deploying The Webtask
1. Clone the repository: `git clone https://github.com/NotMyself/oidc_webtask.git`
2. Change directory into the cloned repository `cd oidc_webtask`.
3. Open the directory in Visual Studio Code: `code .`.
4. Copy the `.env_example` file to a `.env` file in the `src/api` directories.
5. Update the `src/api/.env` file to include Auth0 Domain.
6.  Copy the `.env_example` file to a `.env` file in the `src/client` directories.
7. Update the `src/client/.env` file to include Auth0 Domain and Client ID.
8. Open the integrated terminal: `ctrl ~`.
9. Run the script `scripts/publish`

The output will look like this:

![Deployment](docs/images/deployment.png?raw=true "Deployment")

**Note:** The URL at the end of the output is where your webtask is hosted.

## Implementation Notes

The task I was given was to build a secure Webtask, and add an OIDC provider 
to secure it and do a brief write up on your process and the decisions you made.

@jcenturion and I had previously worked with a prototype webtask compiler that 
allowed you to write React components directly in the webtask editor and have 
it served up as a SPA style website. I decided to use this technique to present 
a frontend that could consume a secured webtask backend API.

The front end uses [Materialize](https://materializecss.com/), [React](https://reactjs.org/), [React Router](https://www.npmjs.com/package/react-router), and [Auth0.js](https://www.npmjs.com/package/auth0-js). I chose 
Materialize as it is a nice front end css framework that I have not used 
previously. I also chose to use the [React Context API](https://reactjs.org/docs/context.html) over some thing like Redux 
to keep things simple as well as to get a sense of what it is like to work with.

The backend api uses [Request](https://www.npmjs.com/package/request-promise-native), [Express](https://expressjs.com/), [Express JWT](https://www.npmjs.com/package/express-jwt), [Express JWT AUthz](https://www.npmjs.com/package/express-jwt-authz) and [Jwks RSA](https://www.npmjs.com/package/jwks-rsa) to create a typical backend API.

Implementation of Authentication was fairly straight forward. I found [this post](https://auth0.com/blog/react-context-api-managing-state-with-ease/) by [Abdulazeez Adeshina](https://twitter.com/kvng_zeez) very helpful in implementing it in React.

Once I had my login implemented, I moved on to creating a secuired API. I found the [Auth0 documentation](https://auth0.com/docs/quickstart/backend/nodejs) very helpful in doing this.

One sticking point that I ran into was specifying an audience correctly. I attempted to use the `UserInfo` audience to secure the API. I had to read up on APIs, Audencies and Scope in the docs.

After creating an API specifically for this demo with apporiate scopes it all started working.
