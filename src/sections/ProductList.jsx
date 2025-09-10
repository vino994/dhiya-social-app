import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../ui/ProductCard';


const PRODUCTS = [
{ id:'p1', title:'Aurora Sneakers', price:59.99, img:'https://picsum.photos/seed/p1/600/400' },
{ id:'p2', title:'Nebula Jacket', price:129.99, img:'https://picsum.photos/seed/p2/600/400' },
{ id:'p3', title:'Lumen Watch', price:199.99, img:'https://picsum.photos/seed/p3/600/400' },
{ id:'p4', title:'Pixel Backpack', price:79.99, img:'https://picsum.photos/seed/p4/600/400' }
];


export default function ProductList(){
return (
<Row>
{PRODUCTS.map(p=> (
<Col sm={6} md={4} lg={3} key={p.id} className="mb-4">
<ProductCard product={p} />
</Col>
))}
</Row>
);
}