import logo from '../logo.svg';
import axios from 'axios';
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { auth, firebase } from '../Authentication/authentication.js';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './Login';
import Register from './Register';
import Nav from './Nav';
import Home from './Home';
import PrivateRoute from './PrivateRoute';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentUser: null,
      posts: null,
      users: null,
    };

    this.updateUserState = this.updateUserState.bind(this);
    this.updatePostsState = this.updatePostsState.bind(this);
    this.updateUsersState = this.updateUsersState.bind(this);
  }

  async componentDidMount() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await this.getUser(token);
        this.setState({ user: user });
        // ...
      } else {
        this.setState({ user: null, loading: false });
      }
    });
  }

  async getUser(token) {
    await axios
      .get('/api/user', {
        headers: { 'Content-Type': 'application/json', authorization2: token },
      })
      .then(({ data }) => {
        console.log('inside getuser', data)
        this.setState({
          currentUser: data.user,
          posts: data.posts,
          loading: false,
        });
      });
  }

  updateUserState(user) {
    this.setState({ currentUser: user });
  }
  updatePostsState(posts) {
    this.setState({ posts: posts });
  }

  updateUsersState(users) {
    this.setState({users: users});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Nav auth={auth}></Nav>
          <Routes>
            <Route
              path="/login"
              element={<Login auth={auth} authenticated={this.state.user} />}
            />
            <Route
              path="/register"
              element={
                <Register
                  auth={auth}
                  authenticated={this.state.user}
                  currentUser={this.state.currentUser}
                  updateUserState={this.updateUserState}
                />
              }
              updateUserState={this.updateUserState}
            />
            <Route
              path="/home"
              element={
                <PrivateRoute auth={this.state.user}>
                  <Home
                    auth={this.state.user}
                    updatePostsState={this.updatePostsState}
                    updateUserState={this.updateUserState}
                    updateUsersState={this.updateUsersState}
                    posts={this.state.posts}
                    currentUser={this.state.currentUser}
                    users={this.state.users}
                  ></Home>
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute auth={this.state.user}>
                  <Home auth={this.state.user}></Home>
                </PrivateRoute>
              }
            />
          </Routes>
        </header>
      </div>
    );
  }
}

export default App;
