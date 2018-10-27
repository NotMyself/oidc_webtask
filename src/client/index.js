const { Component } = React;

const AppContext = React.createContext();

class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...window.WebtaskContext,
      isAuthenticated: false
    };
  }

  onLogin() {
    console.log(this.state);
    this.setState({ isAuthenticated: true });
  };

  onLogout() {
    this.setState({ isAuthenticated: false });
  };

  render() {
    return (
      <AppContext.Provider value={{
        ...this.state,
        onLogin: this.onLogin.bind(this),
        onLogout: this.onLogout.bind(this)
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
          if(!isAuthenticated)
            return (
              <li>
                <a class="waves-effect waves-light btn green" onClick={onLogin}>
                  <i class="material-icons right">person</i>Login
                </a>
              </li>);
          else
            return (
              <li>
                <a class="waves-effect waves-light btn red" onClick={onLogout}>
                  <i class="material-icons right">remove_circle</i>Logout
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
      <nav className="blue">
        <div className="nav-wrapper container">
          <a href="#" className="brand-logo">{WebtaskContext.meta.title}</a>
          <ul class="right hide-on-med-and-down">
            <Login />
          </ul>
        </div>
      </nav>
    );
  }
}

class App extends Component {
  render() {
    return (
      <AppProvider>
        <div className="" style={{ height: '100%' }}>
            <Navbar />
          </div>
      </AppProvider>
    );
  }
}
