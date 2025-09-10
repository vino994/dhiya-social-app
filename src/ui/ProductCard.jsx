import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ProductCard({ product }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <Card className="h-100 product-card shadow-sm">
        {/* Product image */}
        <img
          src={product.img}
          alt={product.title}
          className="card-img-top product-card-img"
        />

        {/* Product details */}
        <Card.Body className="d-flex flex-column text-center">
          <Card.Title className="fw-bold">{product.title}</Card.Title>
          <Card.Text className="text-accent mb-3">${product.price}</Card.Text>

          <div className="mt-auto">
            <Button
              as={Link}
              to={`/product/${product.id}`}
              className="btn-gradient"
            >
              View Product
            </Button>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}
