const { Component } = React;
const { BrowserRouter, Route } = ReactRouterDOM;
const { WebAuth } = auth0;
const { css } = emotion;

const SpeechBubble = styled('div')`
  position: relative;
  background: #ebf1f6;
  border-radius: .4em;
  padding: 10px;
  z-index: 100;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 75%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-bottom-color: #ebf1f6;
    border-top: 0;
    border-left: 0;
    margin-left: -10px;
    margin-top: -20px;
  }
`;

const AppContext = React.createContext();

class AppProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...window.WebtaskContext,
      jokes:[{
        joke:'First you get the token, then you call the API.',
        image: 'https://cdn.auth0.com/website/assets/pages/about/img/leadership/eugenio_pace-1bfa3230d1.jpg'
      }]
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
      if(response.status === 401) {
        this.setState({authError: true});
        M.toast({
          html:`<span><b>${response.status}</b> ${response.statusText}</span>`,
          classes: 'red',
          displayLength: 3000
        });
      }
      else
        return response.json();
    })
    .then(joke => joke && this.setState({ jokes : this.state.jokes.concat([joke]) }))
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
          expiresAt: result.expiresIn * 1000 + new Date().getTime(),
          authError: false
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

class HomePage extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {({profile, jokes}) => {
          return (<Cards profile={profile} jokes={jokes} />);
        }}
      </AppContext.Consumer>
    );
  }
}

class Introduction extends Component {
  render() {
    return (
    <div className="col s9">
      <div className="section">
        <h5>The Wisdom of Eugenio Pace</h5>
        <p>Any Auziro can tell you that a presentation from Eugenio is going to
          include the phrase, <b>"First you get the token, then you call the API."</b>
          It may be included several times in several contexts.</p>
        <p>For more nuggets of wisdom from Eugenio, <b>simply click the button.</b></p>
      </div>
      <AppContext.Consumer>
        {({authError}) => {
          if(authError)
          return (
            <div className="section red-text">
              <h5>Authorization Error</h5>
              <p >Looks like you missed the first bit of
                Eugenio's wisdom. You must get a token then call the API.</p>
              <p><b>Try loggining in first.</b></p>
            </div>
          );
        }}
      </AppContext.Consumer>
      <div className="divider"></div>
      <div className="section">
        <JokeButton />
      </div>
    </div>
    );
  }
}

class JokeButton extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ getJoke }) => {
          return (
            <a className="waves-effect waves-light btn green" onClick={getJoke}>
            <i className="material-icons right">child_care</i>Get Joke
          </a>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

class Cards extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div className="container">
        <div className="row">
            {this.props.jokes.map((e) => {
              return (
                <div className="col s3" key={e.id || 'default'}>
                  <div className="card medium">
                    <div className="card-image">
                      <img src={e.image}></img>
                      <span className="card-title">Eugenio Says:</span>
                    </div>
                    <div className="card-content">
                      <SpeechBubble>
                        <p>{ this.props.profile && e.id ? `${this.props.profile.name}, ${e.joke}` : e.joke}</p>
                      </SpeechBubble>
                    </div>
                  </div>
                </div>
              );
            })}
            {
              this.props.jokes.length == 1 ?
                (<Introduction />) :
                (
                  <div className="col s3" key="button">
                  <div className="card small">
                    <div className="card-content">
                      <span className="card-title">Want More?</span>
                      <p>For another nugget of wisdom, click the button.</p>
                    </div>
                    <div className="card-action">
                      <JokeButton/>
                    </div>
                  </div>
                </div>
                )
            }
        </div>
        <div className="row">

        </div>
      </div>
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
