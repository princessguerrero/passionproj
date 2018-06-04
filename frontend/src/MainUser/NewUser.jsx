import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import "../Stylesheets/Login.css";

class NewUser extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      validEmail: false,
      message: "",
      registered: false,
      loggedIn: false
    };
  }

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitForm = e => {
    //on submit we have to check if the username is taken
    // and if the email is already in use
    e.preventDefault();
    const { username, email, password } = this.state;
    if (email) {
      axios.get("/users").then(response => {
        console.log("RESPONSE FOR GET REQUEST", response.data.data);
        console.log(email);

        if (!response.data.data.find(n => n.email === email)) {
          this.setState({
            validEmail: true
          });
        } else {
          this.setState({
            validEmail: false,
            message: "email already in use"
          });
        }
      });
    }
    if (username && password) {
      if (username.length < 6) {
        return this.setState({
          message: "Username must be at least 6 characters"
        });
      }
      if (password.length < 6) {
        return this.setState({
          message: "Password must be at least 6 characters"
        });
      }
      axios.get("/users").then(response => {
        console.log("RESPONSE FOR GET REQUEST", response.data.data);
        if (!response.data.data.find(n => n.username === username)) {
          axios
            .post("/users/register", {
              username: username,
              email: email,
              password: password
            })
            .then(res => {
              console.log(res.data);
            //   this.props.setUser(res.data);
            //   this.props.active();    
              this.setState({
                message: "Registered user",
                registered: true,
                loggedIn: true
              });
            })
            .then(() => { 
              axios
              .post("/users/login", {
                username: username,
                password: password
              })
              .then(res => {
                console.log(res.data);
                this.props.setUser(res.data);
              //   this.props.active();
                this.setState({
                  username: "",
                  password: "",
                  loggedIn: true
                });
              })
            })
            .catch(err => {
              console.log(err);
              this.setState({
                email: "",
                // fullname: "",
                username: "",
                password: "",
                message: "Error registering user"
              });
            });
        } else {
          this.setState({
            message: "Username already exists"
          });
        }
      });
    } else {
      this.setState({
        message: "Please fill out all forms"
      });
    }
  };

  render() {
    const { username, email, password, message, registered } = this.state;
    console.log(this.state);

    if (registered)
      return (
        <Redirect
          to={{
            pathname: "/users/signup/newuserbio",
            state: { referrer: this.state.username }
          }}
        />
      );

    return (
      <div className="register-user-container">
        {/* nav bar goes here  */}

        <h2 id="navLogoName"> Sign-up. </h2>
        <div className="registerBox" className="registerBox">
          <form onSubmit={this.submitForm} className="new-user-form">
            <input
              className="usernameBox"
              placeholder="Username"
              type="text"
              name="username"
              value={username}
              onChange={this.handleInput}
            />
            <br/>
            <input
              className="emailBox"
              placeholder="Email"
              type="email"
              name="email"
              value={email}
              onChange={this.handleInput}
            />
            <br/>
            <input
              className="passwordBox"
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onChange={this.handleInput}
            />
            <br/>
            <input
              className="loginBtn"
              type="submit"
              value="Sign Up"
              onClick={this.renderNewUserBio}
            />
          </form>
          <div>
            Already have an account?<Link to="/users/login"> Login</Link>
        </div> {/* End smaller-box */}
        </div>
        {message}
      </div>
    );
  }
}

export default NewUser;
