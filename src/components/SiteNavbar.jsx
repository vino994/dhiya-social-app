import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';


export default function SiteNavbar(){
const { currentUser, logout } = useAuth();
const nav = useNavigate();
return (
<Navbar bg="light" expand="lg">
<Container>
<Navbar.Brand as={Link} to="/">E-Shop</Navbar.Brand>
<Navbar.Toggle />
<Navbar.Collapse className="justify-content-end">
<Nav>
<Nav.Link as={Link} to="/">Home</Nav.Link>
<Nav.Link as={Link} to="/checkout">Cart</Nav.Link>
{currentUser ? (
<>
<Nav.Link as={Link} to="/dashboard">{currentUser.name}</Nav.Link>
<Button variant="outline-secondary" size="sm" onClick={()=>{ logout(); nav('/'); }}>Logout</Button>
</>
) : (
<>
<Nav.Link as={Link} to="/login">Login</Nav.Link>
<Nav.Link as={Link} to="/signup">Signup</Nav.Link>
</>
)}
</Nav>
</Navbar.Collapse>
</Container>
</Navbar>
);
}