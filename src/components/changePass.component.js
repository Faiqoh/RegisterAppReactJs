import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";

import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import ReactPasswordToggleIcon from 'react-password-toggle-icon';

const passwordValidator = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%\^&\*])(?=.{8,})");
const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
const vpassword = value => {
  if (!passwordValidator.test(value)){
    return (
      <div className="alert alert-danger" role="alert">
        Password must contain at least 8 characters, 1 number, 1 upper, 1 lowercase and 1 symbol!
      </div>
    );
  }
};

export default class ChangePass extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeConPassword = this.onChangeConPassword.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.state = {
      new_password: "",
      password: "",
      successful: false,
      message: "",
      currentUser: AuthService.getCurrentUser()
    };
  }
  onChangePassword(e) {
    this.setState({
      new_password: e.target.value
    });
  }
  onChangeConPassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      message: "",
      successful: false
    });
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.changePass(
        this.state.currentUser.id,
        this.state.new_password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
          {
            AuthService.logout();
            this.props.history.push("/login");
            window.location.reload();
          }
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }
  
  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <Form
            onSubmit={this.handleChange}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="new_password">New Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="new_password"
                    value={this.state.new_password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm_password">Confirm Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangeConPassword}
                    validations={[required, vpassword]}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block">Update</button>
                </div>
              </div>
            )}
            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}