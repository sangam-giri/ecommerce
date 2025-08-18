// DOM Elements
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTax = document.getElementById('cart-tax');
const cartTotal = document.getElementById('cart-total');
const updateCartBtn = document.getElementById('update-cart');

// Initialize Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display Cart Items
function displayCartItems() {
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartSubtotal.textContent = '$0.00';
            cartTax.textContent = '$0.00';
            cartTotal.textContent = '$0.00';
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-product">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                    </div>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <input type="number" value="${item.quantity}" min="1">
                </div>
                <div class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-remove">
                    <button><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        calculateTotals();

        // Add event listeners to quantity inputs
        document.querySelectorAll('.cart-item-quantity input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
                const newQuantity = parseInt(e.target.value);

                if (newQuantity > 0) {
                    updateCartItemQuantity(itemId, newQuantity);
                } else {
                    e.target.value = 1;
                }
            });
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove button').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
                removeCartItem(itemId);
            });
        });
    }
}

// Calculate Totals
function calculateTotals() {
    if (cartSubtotal && cartTax && cartTotal) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;

        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTax.textContent = `$${tax.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Update Cart Item Quantity
function updateCartItemQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);

    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        calculateTotals();
    }
}

// Remove Cart Item
function removeCartItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();

    // Update cart count in header
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update Cart Button
if (updateCartBtn) {
    updateCartBtn.addEventListener('click', () => {
        // The quantities are already updated when they change
        showNotification('Cart updated successfully!');
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', displayCartItems);