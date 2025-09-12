import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import PRODUCTS from "../data/products";
import "./TShirtCustomizer.css";
import TshirtBase from "../assets/tshirt-1.png"; // ✅ import your T-shirt image

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
    img.src = TshirtBase; // ✅ uses imported image
    img.onload = () => setShirtBaseImg(img);
  }, []);

  // draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shirtBaseImg) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

    // draw shirt base image
    const iw = canvasSize.w * 0.7;
    const ih = canvasSize.h * 0.7;
    const ix = (canvasSize.w - iw) / 2;
    const iy = canvasSize.h * 0.05;

    // draw base white shirt
    ctx.drawImage(shirtBaseImg, ix, iy, iw, ih);

    // apply color overlay
    ctx.fillStyle = shirtColor;
    ctx.globalAlpha = 0.6; // let folds/details show through
    ctx.globalCompositeOperation = "multiply";
    ctx.fillRect(ix, iy, iw, ih);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // draw elements (logos/text)
    elements.forEach((el) => {
      ctx.save();
      ctx.translate(el.x, el.y);
      ctx.rotate((el.rot || 0) * (Math.PI / 180));
      ctx.scale(el.scale || 1, el.scale || 1);

      if (el.type === "image" && el.img) {
        const iw = el.img.width;
        const ih = el.img.height;
        ctx.drawImage(el.img, -iw / 2, -ih / 2, iw, ih);
     } else if (el.type === "text") {
  ctx.font = `${el.fontSize || fontSize}px ${el.fontFamily || "Poppins"}, sans-serif`;
  ctx.fillStyle = el.color || fillColor || getContrastYIQ(shirtColor);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // blend mode
  ctx.globalCompositeOperation = el.blend || "source-over";

  // outline for visibility
  const isLight = document.body.classList.contains("theme-light");
  ctx.lineWidth = Math.max(2, (el.fontSize || fontSize) * 0.08);
  ctx.strokeStyle = isLight
    ? "rgba(255,255,255,0.85)"
    : "rgba(0,0,0,0.85)";

  ctx.strokeText(el.text || textValue, 0, 0);
  ctx.fillText(el.text || textValue, 0, 0);

  // reset blend mode after text
  ctx.globalCompositeOperation = "source-over";
}


      // selection box
      if (el.id === selectedId) {
        const boxW =
          (el.type === "image"
            ? el.img.width
            : ctx.measureText(el.text || textValue).width) || 100;
        const boxH =
          (el.type === "image"
            ? el.img.height
            : el.fontSize || fontSize) || 60;
        ctx.strokeStyle = "rgba(255,122,89,0.95)";
        ctx.lineWidth = 3 / (el.scale || 1);
        ctx.strokeRect(-boxW / 2 - 8, -boxH / 2 - 8, boxW + 16, boxH + 16);
      }

      ctx.restore();
    });
  }, [elements, shirtColor, selectedId, textValue, fontSize, fillColor, canvasSize, shirtBaseImg]);

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
        scale: Math.min(
          0.9 * (canvasSize.w * 0.5) / img.width,
          0.9 * (canvasSize.h * 0.25) / img.height,
          1
        ),
        rot: 0,
      };
      setElements((s) => [...s, el]);
      setSelectedId(el.id);
    };
    img.onerror = () => alert("Failed to load image");
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
  fontFamily: "Poppins",   // ✅ default font
  blend: "source-over",    // ✅ default blend
  color: fillColor || getContrastYIQ(shirtColor),
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
      prev.map((el) =>
        el.id === selectedId ? { ...el, ...partial } : el
      )
    );
  }

  function removeSelected() {
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }

  function exportDesignAndAddToCart() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const metadata = {
      isCustom: true,
      customDesign: dataUrl,
      baseColor: shirtColor,
      productId: product?.id ?? "custom-tee",
      productTitle: product?.title ?? "Custom T-shirt",
    };
    try {
      cart.add(product?.id ?? "custom-tee", { qty: 1, meta: metadata });
    } catch (err) {
      try {
        cart.add({ id: product?.id ?? "custom-tee", meta: metadata });
      } catch (e) {
        console.warn("Cart add failed — adjust call for your cart hook", e);
      }
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

            <div className="d-flex gap-2 align-items-center mb-2">
  <label className="form-label mb-0">Font family</label>
  <Form.Select
    value={selectedEl?.fontFamily || "Poppins"}
    onChange={(e) => updateSelected({ fontFamily: e.target.value })}
  >
    <option value="Poppins">Poppins</option>
    <option value="Arial">Arial</option>
    <option value="Georgia">Georgia</option>
    <option value="Courier New">Courier New</option>
    <option value="Times New Roman">Times New Roman</option>
  </Form.Select>
</div>

<div className="d-flex gap-2 align-items-center mb-2">
  <label className="form-label mb-0">Blend mode</label>
  <Form.Select
    value={selectedEl?.blend || "source-over"}
    onChange={(e) => updateSelected({ blend: e.target.value })}
  >
    <option value="source-over">Normal</option>
    <option value="multiply">Multiply</option>
    <option value="overlay">Overlay</option>
    <option value="screen">Screen</option>
    <option value="darken">Darken</option>
    <option value="lighten">Lighten</option>
  </Form.Select>
</div>


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
                <div className="text-muted">
                  Click an element on the shirt to select it.
                </div>
              ) : (
                <>
                  <div className="mb-2">Type: {selectedEl.type}</div>

                  {selectedEl.type === "text" && (
                    <Form.Control
                      className="mb-2"
                      value={selectedEl.text}
                      onChange={(e) =>
                        updateSelected({ text: e.target.value })
                      }
                    />
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
                    <Button
                      variant="outline-secondary"
                      onClick={() => moveZ(selectedEl.id, "back")}
                    >
                      Send back
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => moveZ(selectedEl.id, "front")}
                    >
                      Bring front
                    </Button>
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
                Add to cart (custom)
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

  function moveZ(id, dir = "front") {
    setElements((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx < 0) return prev;
      const item = prev[idx];
      const copy = prev.slice();
      copy.splice(idx, 1);
      if (dir === "front") copy.push(item);
      else copy.unshift(item);
      return copy;
    });
  }
}
