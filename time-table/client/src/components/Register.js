import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback
} from "reactstrap";
import "../index.css";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
      errors: {},
      showPassword: false,
      showConfirmPassword: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleShowPassword = this.toggleShowPassword.bind(this);
    this.toggleShowConfirmPassword = this.toggleShowConfirmPassword.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/calladdblank");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggleShowPassword() {
    this.setState(prev => ({ showPassword: !prev.showPassword }));
  }

  toggleShowConfirmPassword() {
    this.setState(prev => ({ showConfirmPassword: !prev.showConfirmPassword }));
  }

  handleSubmit(event) {
    event.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      confirmpassword: this.state.confirmpassword
    };
    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors, showPassword, showConfirmPassword } = this.state;

    return (
      <div className="container page">
        <div className="verticalspace">
          <div className="row">
            <div className="col-12 mb-3">
              <h2>Sign Up</h2>
            </div>
            <div className="col-12 col-md-9">
              <Form onSubmit={this.handleSubmit}>
                {/* Name Field */}
                <FormGroup row>
                  <Col md={{ size: 2, offset: 3 }}>
                    <Label htmlFor="name">Name</Label>
                  </Col>
                  <Col md={7}>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fa fa-user icon" />
                        </span>
                      </div>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={this.state.name}
                        onChange={this.handleInputChange}
                        className={classnames(
                          "form-control",
                          { "is-invalid": errors.name }
                        )}
                      />
                      <FormFeedback>{errors.name}</FormFeedback>
                    </div>
                  </Col>
                </FormGroup>

                {/* Email Field */}
                <FormGroup row>
                  <Col md={{ size: 2, offset: 3 }}>
                    <Label htmlFor="email">Email</Label>
                  </Col>
                  <Col md={7}>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fa fa-envelope icon" />
                        </span>
                      </div>
                      <Input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        className={classnames(
                          "form-control",
                          { "is-invalid": errors.email }
                        )}
                      />
                      <FormFeedback>{errors.email}</FormFeedback>
                    </div>
                  </Col>
                </FormGroup>

                {/* Password Field with Toggle */}
                <FormGroup row>
                  <Col md={{ size: 2, offset: 3 }}>
                    <Label htmlFor="password">Password</Label>
                  </Col>
                  <Col md={7}>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fa fa-lock icon" />
                        </span>
                      </div>
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        className={classnames(
                          "form-control",
                          { "is-invalid": errors.password }
                        )}
                      />
                      <div className="input-group-append">
                        <Button
                          type="button"
                          color="secondary"
                          onClick={this.toggleShowPassword}
                        >
                          <i
                            className={
                              showPassword ? "fa fa-eye-slash" : "fa fa-eye"
                            }
                            aria-hidden="true"
                          />
                        </Button>
                      </div>
                      <FormFeedback>{errors.password}</FormFeedback>
                    </div>
                  </Col>
                </FormGroup>

                {/* Confirm Password Field with Toggle */}
                <FormGroup row>
                  <Col md={{ size: 2, offset: 3 }}>
                    <Label htmlFor="confirmpassword">Confirm Password</Label>
                  </Col>
                  <Col md={7}>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fa fa-lock icon" />
                        </span>
                      </div>
                      <Input
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        id="confirmpassword"
                        name="confirmpassword"
                        placeholder="Confirm Password"
                        value={this.state.confirmpassword}
                        onChange={this.handleInputChange}
                        className={classnames(
                          "form-control",
                          { "is-invalid": errors.confirmpassword }
                        )}
                      />
                      <div className="input-group-append">
                        <Button
                          type="button"
                          color="secondary"
                          onClick={this.toggleShowConfirmPassword}
                        >
                          <i
                            className={
                              showConfirmPassword
                                ? "fa fa-eye-slash"
                                : "fa fa-eye"
                            }
                            aria-hidden="true"
                          />
                        </Button>
                      </div>
                      <FormFeedback>{errors.confirmpassword}</FormFeedback>
                    </div>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md={{ size: 10, offset: 3 }}>
                    <Button type="submit" color="secondary" className="mt-2">
                      Submit
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
