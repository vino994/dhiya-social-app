import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import PRODUCTS from "../data/products";
import "./TShirtCustomizer.css";
import TshirtBase from "../assets/tshirt-1.png"; // ✅ base shirt

// helper to create IDs
function createId() {
  return Math.random().toString(36).slice(2, 9);
}

// helper: auto contrast black/white for shirt background
function getContrastYIQ(hex) {
  if (!hex) return "#111111";
  hex = hex.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#111111" : "#ffffff";
}

// ✅ curved text helper
function drawCurvedText(ctx, text, radius, fontSize, color) {
  if (!text) return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Poppins, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const angleStep = (Math.PI * 2) / (text.length * 2);
  let startAngle = -((text.length - 1) * angleStep) / 2;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    ctx.save();
    const angle = startAngle + i * angleStep;
    ctx.rotate(angle);
    ctx.translate(0, -radius);
    ctx.rotate(-angle);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

export default function TShirtCustomizer({ productFromProps }) {
  const { id: routeId } = useParams();
  const productId = productFromProps?.id ?? routeId;
  const product =
    PRODUCTS.find((p) => p.id === productId) ?? productFromProps ?? null;

  const canvasRef = useRef(null);
  const [canvasSize] = useState({ w: 900, h: 1100 });
  const [shirtColor, setShirtColor] = useState(
    product?.colors?.[0]?.hex ?? "#ffffff"
  );
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ offsetX: 0, offsetY: 0 });
  const [textValue, setTextValue] = useState("");
  const [fontSize, setFontSize] = useState(64);
  const [fillColor, setFillColor] = useState("");
  const navigate = useNavigate();
  const cart = useCart();

  // load tshirt image
  const [shirtBaseImg, setShirtBaseImg] = useState(null);
  useEffect(() => {
    const img = new Image();
    img.src = TshirtBase;
    img.onload = () => setShirtBaseImg(img);
  }, []);

  // draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shirtBaseImg) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

    const iw = canvasSize.w * 0.7;
    const ih = canvasSize.h * 0.7;
    const ix = (canvasSize.w - iw) / 2;
    const iy = canvasSize.h * 0.05;

    ctx.drawImage(shirtBaseImg, ix, iy, iw, ih);

    ctx.fillStyle = shirtColor;
    ctx.globalAlpha = 0.6;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillRect(ix, iy, iw, ih);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    elements.forEach((el) => {
      ctx.save();
      ctx.translate(el.x, el.y);
      ctx.rotate((el.rot || 0) * (Math.PI / 180));
      ctx.scale(el.scale || 1, el.scale || 1);

      if (el.type === "image" && el.img) {
        ctx.drawImage(el.img, -el.img.width / 2, -el.img.height / 2);
      } else if (el.type === "text") {
        const color = el.color || fillColor || getContrastYIQ(shirtColor);
        if (el.curved) {
          drawCurvedText(
            ctx,
            el.text,
            el.curveRadius || 150,
            el.fontSize || fontSize,
            color
          );
        } else {
          ctx.font = `${el.fontSize || fontSize}px ${
            el.fontFamily || "Poppins"
          }, sans-serif`;
          ctx.fillStyle = color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(el.text, 0, 0);
        }
      }

      if (el.id === selectedId) {
        ctx.strokeStyle = "rgba(255,122,89,0.95)";
        ctx.lineWidth = 3 / (el.scale || 1);
        ctx.strokeRect(-80, -80, 160, 160);
      }

      ctx.restore();
    });
  }, [elements, shirtColor, selectedId, textValue, fontSize, fillColor, canvasSize, shirtBaseImg]);

  // ✅ Drag & drop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function getMousePos(evt) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((evt.clientX - rect.left) / rect.width) * canvasSize.w,
        y: ((evt.clientY - rect.top) / rect.height) * canvasSize.h,
      };
    }

    function handleDown(e) {
      const pos = getMousePos(e);
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        const dx = pos.x - el.x;
        const dy = pos.y - el.y;
        const hitBox = 100;
        if (Math.abs(dx) < hitBox && Math.abs(dy) < hitBox) {
          setSelectedId(el.id);
          dragRef.current = { offsetX: dx, offsetY: dy };
          setDragging(true);
          break;
        }
      }
    }

    function handleMove(e) {
      if (!dragging || !selectedId) return;
      const pos = getMousePos(e);
      updateSelected({
        x: pos.x - dragRef.current.offsetX,
        y: pos.y - dragRef.current.offsetY,
      });
    }

    function handleUp() {
      setDragging(false);
    }

    canvas.addEventListener("mousedown", handleDown);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      canvas.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [elements, dragging, selectedId]);

  // add uploaded image
  async function handleImageUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => {
      const el = {
        id: createId(),
        type: "image",
        img,
        x: canvasSize.w / 2,
        y: canvasSize.h / 2,
        scale: 0.5,
        rot: 0,
      };
      setElements((s) => [...s, el]);
      setSelectedId(el.id);
    };
    img.src = URL.createObjectURL(f);
    e.target.value = "";
  }

  function addText() {
    if (!textValue.trim()) return;
    const el = {
      id: createId(),
      type: "text",
      text: textValue,
      fontSize,
      fontFamily: "Poppins",
      color: fillColor || getContrastYIQ(shirtColor),
      curved: false,
      curveRadius: 150,
      x: canvasSize.w / 2,
      y: canvasSize.h / 2,
      scale: 1,
      rot: 0,
    };
    setElements((s) => [...s, el]);
    setSelectedId(el.id);
    setTextValue("");
  }

  function updateSelected(partial) {
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, ...partial } : el))
    );
  }

  function removeSelected() {
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }

  // ✅ Save design, fixed price 499
  function exportDesignAndAddToCart() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");

    const metadata = {
      isCustom: true,
      customDesign: dataUrl, // ✅ saved image
      baseColor: shirtColor,
      productId: "custom-tee",
      productTitle: "Custom T-shirt",
      price: 499, // ✅ fixed price
    };

    try {
      cart.add("custom-tee", { qty: 1, price: 499, meta: metadata });
    } catch {
      cart.add({ id: "custom-tee", price: 499, qty: 1, meta: metadata });
    }
    navigate("/checkout");
  }

  const selectedEl = elements.find((e) => e.id === selectedId);

  return (
    <Container className="customizer-section">
      <Row className="g-4">
        <Col lg={8}>
          <div className="canvas-wrap">
            <canvas
              ref={canvasRef}
              width={canvasSize.w}
              height={canvasSize.h}
              style={{ width: "100%", height: "auto", borderRadius: 12 }}
            />
          </div>
        </Col>
        <Col lg={4}>
          <div className="controls">
            <h5>Customize T-shirt</h5>

            <div className="mb-3">
              <label className="form-label">Base color</label>
              <input
                type="color"
                value={shirtColor}
                onChange={(e) => setShirtColor(e.target.value)}
                className="form-control form-control-color"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload image (logo)</label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Add text</label>
              <InputGroup className="mb-2">
                <Form.Control
                  placeholder="Your text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                />
                <Button onClick={addText}>Add</Button>
              </InputGroup>

              <div className="d-flex gap-2 align-items-center">
                <label className="form-label mb-0">Text color</label>
                <input
                  type="color"
                  value={fillColor || "#111111"}
                  onChange={(e) => setFillColor(e.target.value)}
                />
              </div>
            </div>

            <hr />

            <div className="mb-3">
              <h6 className="mb-2">Selected element</h6>
              {!selectedEl ? (
                <div className="text-muted">Click an element to select it.</div>
              ) : (
                <>
                  <div className="mb-2">Type: {selectedEl.type}</div>

                  {selectedEl.type === "text" && (
                    <>
                      <Form.Control
                        className="mb-2"
                        value={selectedEl.text}
                        onChange={(e) =>
                          updateSelected({ text: e.target.value })
                        }
                      />
                      <Form.Check
                        type="switch"
                        label="Curved text"
                        checked={!!selectedEl.curved}
                        onChange={(e) =>
                          updateSelected({ curved: e.target.checked })
                        }
                      />
                      {selectedEl.curved && (
                        <div className="mb-2">
                          <label className="form-label">Curve radius</label>
                          <input
                            type="range"
                            min="50"
                            max="400"
                            value={selectedEl.curveRadius || 150}
                            onChange={(e) =>
                              updateSelected({
                                curveRadius: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="mb-2">
                    <label className="form-label">Scale</label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.01"
                      value={selectedEl.scale || 1}
                      onChange={(e) =>
                        updateSelected({ scale: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Rotate</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={selectedEl.rot || 0}
                      onChange={(e) =>
                        updateSelected({ rot: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="d-flex gap-2 mt-2">
                    <Button variant="danger" onClick={removeSelected}>
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 d-grid">
              <Button
                className="btn-gradient"
                onClick={exportDesignAndAddToCart}
              >
                Add to cart (₹499)
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
