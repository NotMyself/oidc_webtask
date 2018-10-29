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
