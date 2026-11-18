// SPORTZONE - Catálogo y carrito demostrativo

// Lista de productos. Puedes cambiar nombres, descripciones, precios e imágenes.
const productos = [
  { id: 1, nombre: "Zapatillas Running Pro", categoria: "calzado", etiqueta: "MÁS VENDIDO", descripcion: "Comodidad y amortiguación para tus carreras.", precio: 699, imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85" },
  { id: 2, nombre: "Balón de fútbol", categoria: "futbol", etiqueta: "FÚTBOL", descripcion: "Ideal para entrenamientos y partidos.", precio: 249, imagen: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=700&q=85" },
  { id: 3, nombre: "Polera deportiva", categoria: "ropa", etiqueta: "NUEVO", descripcion: "Tela ligera y cómoda para entrenar.", precio: 199, imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85" },
  { id: 4, nombre: "Botella deportiva", categoria: "accesorios", etiqueta: "ACCESORIOS", descripcion: "Mantente hidratado durante tu actividad.", precio: 99, imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85" },
  { id: 5, nombre: "Zapatillas Training", categoria: "calzado", etiqueta: "ENTRENAMIENTO", descripcion: "Estabilidad y soporte para el gimnasio.", precio: 579, imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85" },
  { id: 6, nombre: "Guantes deportivos", categoria: "accesorios", etiqueta: "FITNESS", descripcion: "Agarre cómodo para tus rutinas.", precio: 129, imagen: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=85" },
  { id: 7, nombre: "Short deportivo", categoria: "ropa", etiqueta: "LIGERO", descripcion: "Libertad de movimiento en cada ejercicio.", precio: 149, imagen: "https://runnractive.com/cdn/shop/files/4_349d130f-eb44-4397-b31a-c71b8191e9d8.png?v=1774594388&width=800" },
  { id: 8, nombre: "Balón de básquet", categoria: "futbol", etiqueta: "BÁSQUET", descripcion: "Diseño resistente para jugar en equipo.", precio: 219, imagen: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=700&q=85" }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

let categoriaActual = "todos";
let carrito = [];

function formatoPrecio(precio) {
  return "Bs " + precio.toLocaleString("es-BO");
}

function mostrarProductos() {
  const texto = searchInput.value.trim().toLowerCase();
  const filtrados = productos.filter(producto => {
    const coincideCategoria = categoriaActual === "todos" || producto.categoria === categoriaActual;
    const coincideTexto = producto.nombre.toLowerCase().includes(texto) || producto.descripcion.toLowerCase().includes(texto);
    return coincideCategoria && coincideTexto;
  });

  if (filtrados.length === 0) {
    productGrid.innerHTML = '<p class="no-results">No encontramos productos con esa búsqueda.</p>';
    return;
  }

  productGrid.innerHTML = filtrados.map(producto => `
    <article class="product-card">
      <div class="product-image">
        <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        <span class="product-label">${producto.etiqueta}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p class="product-description">${producto.descripcion}</p>
        <div class="product-bottom">
          <strong class="product-price">${formatoPrecio(producto.precio)}</strong>
          <button class="add-button" data-add="${producto.id}">+ AGREGAR</button>
        </div>
      </div>
    </article>
  `).join("");
}

function agregarAlCarrito(id) {
  const producto = productos.find(item => item.id === id);
  const existente = carrito.find(item => item.id === id);
  if (existente) existente.cantidad++;
  else carrito.push({ ...producto, cantidad: 1 });
  actualizarCarrito();
  mostrarToast(producto.nombre + " agregado al carrito");
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(producto => producto.id === id);
  if (!item) return;
  item.cantidad += cambio;
  if (item.cantidad <= 0) carrito = carrito.filter(producto => producto.id !== id);
  actualizarCarrito();
}

function quitarDelCarrito(id) {
  carrito = carrito.filter(producto => producto.id !== id);
  actualizarCarrito();
}

function actualizarCarrito() {
  const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);
  const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  cartCount.textContent = unidades;
  cartTotal.textContent = formatoPrecio(subtotal);

  if (carrito.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Todavía no agregaste productos.</p>';
    return;
  }

  cartItems.innerHTML = carrito.map(item => `
    <article class="cart-item">
      <img src="${item.imagen}" alt="${item.nombre}">
      <div>
        <h4>${item.nombre}</h4>
        <p>${formatoPrecio(item.precio * item.cantidad)}</p>
        <div class="quantity-controls">
          <button data-minus="${item.id}" aria-label="Restar">−</button>
          <span>${item.cantidad}</span>
          <button data-plus="${item.id}" aria-label="Sumar">+</button>
        </div>
      </div>
      <button class="remove-item" data-remove="${item.id}" aria-label="Eliminar producto">×</button>
    </article>
  `).join("");
}

function abrirCarrito() {
  document.body.classList.add("cart-open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function cerrarCarrito() {
  document.body.classList.remove("cart-open");
  cartPanel.setAttribute("aria-hidden", "true");
}

let toastTimer;
function mostrarToast(mensaje) {
  toast.textContent = mensaje;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// Eventos del catálogo: se utiliza delegación para atender los botones de cada tarjeta.
productGrid.addEventListener("click", event => {
  const boton = event.target.closest("[data-add]");
  if (boton) agregarAlCarrito(Number(boton.dataset.add));
});

filters.addEventListener("click", event => {
  const boton = event.target.closest("[data-category]");
  if (!boton) return;
  categoriaActual = boton.dataset.category;
  document.querySelectorAll(".filter").forEach(filtro => filtro.classList.remove("active"));
  boton.classList.add("active");
  mostrarProductos();
});

searchInput.addEventListener("input", mostrarProductos);

cartItems.addEventListener("click", event => {
  const mas = event.target.closest("[data-plus]");
  const menos = event.target.closest("[data-minus]");
  const quitar = event.target.closest("[data-remove]");
  if (mas) cambiarCantidad(Number(mas.dataset.plus), 1);
  if (menos) cambiarCantidad(Number(menos.dataset.minus), -1);
  if (quitar) quitarDelCarrito(Number(quitar.dataset.remove));
});

document.getElementById("openCart").addEventListener("click", abrirCarrito);
document.getElementById("closeCart").addEventListener("click", cerrarCarrito);
cartBackdrop.addEventListener("click", cerrarCarrito);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") cerrarCarrito();
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (carrito.length === 0) {
    mostrarToast("Agrega algún producto antes de continuar.");
    return;
  }
  mostrarToast("¡Gracias! Esta es una demostración, no se realizan pagos.");
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const abierto = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(abierto));
});
mainNav.querySelectorAll("a").forEach(enlace => enlace.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("year").textContent = new Date().getFullYear();

// Primera carga: mostrar todos los productos.
mostrarProductos();
actualizarCarrito();
