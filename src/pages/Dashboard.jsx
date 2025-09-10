import React from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthProvider';


export default function Dashboard(){
const { currentUser } = useAuth();
return (
<Container className="dashboard-section">
<h3>Welcome, {currentUser?.name}</h3>
<p>This is your dashboard — add orders, uploads or profile edits here.</p>
</Container>
);
}