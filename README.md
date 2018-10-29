# OIDC Webtask

![Auth0 Wisdom](/docs/images/auth0-wisdom-demo.gif?raw=true "Auth0 Wisdom")

A Sample webtask project that uses Auth0's OIDC Provider for authentication.

## Getting Started

1. Install [Node v8.2.1 or Above](https://nodejs.org/en/).
1. Install [Visual Studio Code](https://code.visualstudio.com/), the [Insiders Edition](https://code.visualstudio.com/insiders) is highly recommended.
1. Clone the repository: `git clone https://github.com/NotMyself/ReactNorris.git`
1. Change directory into the cloned repository `cd ReactNorris`.
1. Restore packages: `npm install`.
1. Open the directory in Visual Studio Code: `code .`.
1. Open the integrated terminal: `ctrl ~`.
1. Start the development server: `npm start`.

A browser window should open and display the site.

**Note:** You can also continuously run the unit tests by opening another terminal window and running the command `npm test`.

## Requirements & Implementations

1. The UI must be built on [Bootstrap 4.0](https://getbootstrap.com/).
   * **ReactNorris uses [reactstrap](https://reactstrap.github.io/), a set of Bootstrap 4 based React components.**
1. I must be able see the available [categories](https://api.chucknorris.io/jokes/categories) from https://api.chucknorris.io.
   * **The home page features a Bootstrap based dropdown button. This button defaults to `Random`. The user can see the list of categories in the dropdown list.**
1. I must be able to select an available [category](https://api.chucknorris.io/jokes/categories), and retrieve a Chuck Norris joke from the selected category.
   * **The user can select any of the categories of Chuck Jokes from the dropdown list. Clicking the button will display a random joke from that category.**
1. I want to make a [random joke](https://api.chucknorris.io/jokes/random) appear every so many (5?) seconds on the website.
   * **The user can flip the toggle switch below the Joke Card to automatically refresh with a new random joke from the selected category every 5 seconds.**
1. I want to be able to toggle the random joke train on/off with a [stylish switch](http://cdn.cssflow.com/snippets/simple-toggle-switch/preview-260.png). (Must use a 3rd party component)
   * **Toggle switch makes this functionality happen. It uses [react-switch](https://github.com/yogaboll/react-switch) a third party React component.**
1. I must be able to search jokes with [free text](https://api.chucknorris.io/jokes/search?query={query})
   * **Click the `Search` menu item to view the search page. The user can enter text and click the search button. All results will be displayed.**
1. I must be able to see an image of Chuck Norris or digital representation of Chuck Norris.
   * **The Joke Card display shows the image associated with the joke from the api results. Sadly, the image does not appear to change.**
  