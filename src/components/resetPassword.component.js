import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import AuthService from "../services/auth.service";

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

const vemail = value => {
    if (!isEmail(value)) {
      return (
        <div className="alert alert-danger" role="alert">
          This is not a valid email.
        </div>
      );
    }
};

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.state = {
      new_password: "",
      email: "",
      successful: false,
      message: "",
      currentUser: AuthService.getCurrentUser(),
      loading: false
    };
  }
  onChangePassword(e) {
    this.setState({
      new_password: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      message: "",
      successful: false,
      loading: true
    });
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.resetPass(
        this.props.match.params.id,
        this.state.new_password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true,
            loading: false
          });
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
            message: resMessage,
            loading: false
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
                {/* <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="email"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, vemail]}
                  />
                </div> */}
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
                    <button
                        className="btn btn-primary btn-block"
                        disabled={this.state.loading}
                    >
                        {this.state.loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <span>Send</span>
                    </button>
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