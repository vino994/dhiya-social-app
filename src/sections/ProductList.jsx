import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../ui/ProductCard';
import img1 from "../assets/t-8.jpg"; // ✅ replace with your image
import img2 from "../assets/t-9.webp";
import img3 from "../assets/t-3.webp"; // ✅ replace with your image
import img4 from "../assets/t-4.webp";
const PRODUCTS = [
{ id:'p1', title:'Aurora Sneakers', price:59.99, img:img1 },
{ id:'p2', title:'Nebula Jacket', price:129.99, img:img2 },
{ id:'p3', title:'Lumen Watch', price:199.99, img:img3 },
{ id:'p4', title:'Pixel Backpack', price:79.99, img: img4}
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