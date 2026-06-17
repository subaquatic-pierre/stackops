# Website

## Installation

`npm start`
Starts the development server.

`npm run build`
Bundles your website into static files for production.

`npm run serve`
Serves the built website locally.

`npm run deploy`
Publishes the website to GitHub pages.

We recommend that you begin by typing:

`cd stack-garden`
`npm start`

Happy building awesome websites!

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
