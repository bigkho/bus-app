import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavbarComp = () => (
  <Navbar bg="dark" variant="dark" expand="lg">
    <Container>
      <Navbar.Brand as={Link} to="/">MTAConnect</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar">
        <Nav className="ms-auto">
        
          <Nav.Link as={Link} to="/">Home</Nav.Link>

        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default NavbarComp;