// src/components/ProductCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

export default function ProductCard({ product }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="h-100 product-card shadow-sm">
        <img
          src={product.img}
          alt={product.title}
          className="card-img-top product-card-img"
          style={{ objectFit: 'cover', height: 180, width: '100%' }}
        />

        <Card.Body className="d-flex flex-column text-center">
          <Card.Title className="fw-bold card-box">{product.title}</Card.Title>
          <Card.Text className="text-accent mb-3"> &#8377;{product.price.toFixed(2)}</Card.Text>

          <div className="mt-auto">
            <Button as={Link} to={`/product/${product.id}`} className="btn-gradient">
              View Product
            </Button>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}
