import React from "react";
import { CardImg, CardTitle, Row, Col, CardBody } from "reactstrap";
import "../index.css";

function About() {
  return (
    <div className="container page">
      <h1 className="mt-4">About Us</h1>
      <div className="mt-5">
        <Row>
          <Col sm="4">
            <CardImg src="" />
            <CardBody>
              <CardTitle>
                <strong className="name"></strong>
                <br />
                <span className="social-media"></span>
              </CardTitle>
            </CardBody>
          </Col>

          <Col sm="4">
            <CardImg src="" />
            <CardBody>
              <CardTitle>
                <strong className="name"></strong>
                <br />
                <span className="social-media"></span>
              </CardTitle>
            </CardBody>
          </Col>

          <Col sm="4">
            <CardImg src="" />
            <CardBody>
              <CardTitle>
                <strong className="name"></strong>
                <br />
                <span className="social-media"></span>
              </CardTitle>
            </CardBody>
          </Col>
        </Row>

        <Row>
          <Col sm="4">
            <CardImg src="" />
            <CardBody>
              <CardTitle>
                <strong className="name"></strong>
                <br />
                <span className="social-media"></span>
              </CardTitle>
            </CardBody>
          </Col>

          <Col sm="4">
            <CardImg src="" />
            <CardBody>
              <CardTitle>
                <strong className="name"></strong>
                <br />
                <span className="social-media"></span>
              </CardTitle>
            </CardBody>
          </Col>

          <Col sm="4">
            <CardImg src="" />
            <CardBody>
              <CardTitle>
                <strong className="name"></strong>
                <br />
                <span className="social-media"></span>
              </CardTitle>
            </CardBody>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default About;
