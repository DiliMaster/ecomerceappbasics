const productGrid = document.querySelector('.product-grid');
const cartLink = document.getElementById('cart-link');
const cartSection = document.getElementById('cart');
const cartCount = document.getElementById('cart-count');
const cartTableBody = document.querySelector('#cart-table tbody');
const cartTotal = document.getElementById('cart-total');

let cart = [];

// Fetch products from the backend
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        productGrid.innerHTML = products.map(product => `
            <div class="product" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `).join('');

        // Add event listeners for "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productElement = button.closest('.product');
                const id = productElement.getAttribute('data-id');
                const name = productElement.getAttribute('data-name');
                const price = parseFloat(productElement.getAttribute('data-price'));

                const existingProduct = cart.find(item => item.id === id);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push({ id, name, price, quantity: 1 });
                }
                updateCart();
            });
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Update cart UI
function updateCart() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartTableBody.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const row = document.createElement('tr');
        total += item.price * item.quantity;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove" data-id="${item.id}">Remove</button></td>
        `;
        cartTableBody.appendChild(row);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;

    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            cart = cart.filter(item => item.id !== id);
            updateCart();
        });
    });
}

// Checkout
document.getElementById('checkout-button').addEventListener('click', async () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart })
        });
        const data = await response.json();
        alert(data.message + ` Total: $${data.total.toFixed(2)}`);
        cart = []; // Clear cart after checkout
        updateCart();
    } catch (error) {
        console.error("Error during checkout:", error);
    }
});

// Initialize
fetchProducts();