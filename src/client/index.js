const { Component } = React;
const { BrowserRouter, Route } = ReactRouterDOM;
const { WebAuth } = auth0;

const AppContext = React.createContext();

class AppProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...window.WebtaskContext
    };

    this.auth0 = new WebAuth({
      domain: this.state.secrets.AUTH0_DOMAIN,
      audience: this.state.meta.API_URL,
      clientID: this.state.secrets.AUTH0_CLIENT_ID,
      redirectUri: `${window.location.origin}/oidc-client/callback`,
      responseType: 'token id_token',
      scope: 'openid profile read:jokes'
    });
  }

  getJoke() {
    fetch(this.state.meta.API_URL, {
      headers: new Headers({
        'Authorization': `Bearer ${this.state.accessToken}`
      })
    })
    .then(response => {
      if(response.status === 401)
        M.toast({
          html:`<span><b>${response.status}</b> ${response.statusText}</span>`,
          classes: 'red',
          displayLength: 3000
        });
      else
        return response.json();
    })
    .then(joke => this.setState({ joke }))
    .catch(err => M.toast({
        html:`<span><b>Error:</b> ${err.message}</span>`,
        classes: 'red',
        displayLength: 3000
      })
    );
  }

  isAuthenticated() {
    return new Date().getTime() < this.state.expiresAt;
  }

  handleAuthentication() {
    if(this.isAuthenticated())
      return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, result) => {
        if (err) return reject(err);
        this.setState({
          idToken: result.idToken,
          accessToken: result.accessToken,
          profile: result.idTokenPayload,
          expiresAt: result.expiresIn * 1000 + new Date().getTime()
        });
        resolve();
      });
    });
  }

  onLogin() {
    this.auth0.authorize();
  };

  onLogout() {
    this.setState({
      idToken: null,
      accessToken: null,
      profile: null,
      expiresAt: null
    });
  };

  render() {
    return (
      <AppContext.Provider value={{
        ...this.state,
        isAuthenticated: this.isAuthenticated.bind(this),
        handleAuthentication: this.handleAuthentication.bind(this),
        onLogin: this.onLogin.bind(this),
        onLogout: this.onLogout.bind(this),
        getJoke: this.getJoke.bind(this)
        }}>
        { this.props.children }
      </AppContext.Provider>
    );
  }
}

class Login extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ isAuthenticated, onLogin, onLogout }) => {
          if(isAuthenticated())
            return (
                <li>
                  <a className="waves-effect waves-light btn red" onClick={onLogout}>
                    <i className="material-icons right">remove_circle</i>Logout
                  </a>
                </li>);

          else
            return (
                <li>
                  <a className="waves-effect waves-light btn green" onClick={onLogin}>
                    <i className="material-icons right">person</i>Login
                  </a>
                </li>);
          }
        }
      </AppContext.Consumer>
    );
  }
}

class Navbar extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ meta }) => {
          return (
            <nav className="blue">
              <div className="nav-wrapper container">
                <a href="#" className="brand-logo">{meta.title}</a>
                <ul className="right hide-on-med-and-down">
                  <Login />
                </ul>
              </div>
            </nav>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

class CallBack extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppContext.Consumer>
        {({ handleAuthentication }) => {
          handleAuthentication()
            .then(() => {
              this.props.history.push('/');
            });
          return (
            <h1>
              Loading user profile.
            </h1>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

class Introduction extends Component {
  render() {
    return (
      <div className="container">
        <h1>Hi!</h1>
      </div>
    );
  }
}

class Foo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="container">
        <h1>Foo</h1>
        <a className="waves-effect waves-light btn green" onClick={this.props.onJokeClick}>
          <i className="material-icons right">child_care</i>Get Joke
        </a>
      </div>
    );
  }
}

class HomePage extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {({isAuthenticated, getJoke}) => {
          if(isAuthenticated())
            return (<Foo onJokeClick={getJoke} />);
          else
            return (<Introduction onJokeClick={getJoke} />);
        }}
      </AppContext.Consumer>
    );
  }
}

class App extends Component {
  render() {
    return (
      <BrowserRouter basename="/oidc-client">
        <AppProvider>
            <div className="App" style={{ height: '100%' }}>
              <Navbar />
              <Route exact path='/' component={HomePage} />
              <Route exact path='/callback' component={CallBack} />
            </div>
        </AppProvider>
      </BrowserRouter>
    );
  }
}
