// Initialize the store data if it doesn't exist
function initializeStoreData() {
    if (!localStorage.getItem('shopEasyStore')) {
        const defaultStoreData = {
            storeName: 'ShopEasy',
            taxRate: 8.5,
            products: [
                {
                    id: 1,
                    name: 'Wireless Headphones',
                    price: 99.99,
                    category: 'Electronics',
                    image: 'https://via.placeholder.com/300x300?text=Wireless+Headphones',
                    description: 'High-quality wireless headphones with noise cancellation.',
                    featured: true
                },
                {
                    id: 2,
                    name: 'Smart Watch',
                    price: 199.99,
                    category: 'Electronics',
                    image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
                    description: 'Feature-rich smartwatch with health monitoring.',
                    featured: true
                },
                {
                    id: 3,
                    name: 'Running Shoes',
                    price: 79.99,
                    category: 'Sports',
                    image: 'https://via.placeholder.com/300x300?text=Running+Shoes',
                    description: 'Comfortable running shoes with great support.',
                    featured: false
                },
                {
                    id: 4,
                    name: 'Coffee Maker',
                    price: 49.99,
                    category: 'Home',
                    image: 'https://via.placeholder.com/300x300?text=Coffee+Maker',
                    description: 'Automatic coffee maker for your perfect brew.',
                    featured: false
                }
            ],
            orders: []
        };
        localStorage.setItem('shopEasyStore', JSON.stringify(defaultStoreData));
    }
}

// Get store data
function getStoreData() {
    return JSON.parse(localStorage.getItem('shopEasyStore'));
}

// Update store data
function updateStoreData(data) {
    localStorage.setItem('shopEasyStore', JSON.stringify(data));
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('shopEasyCart');
    return cart ? JSON.parse(cart) : [];
}

// Update cart in localStorage
function updateCart(cart) {
    localStorage.setItem('shopEasyCart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in the header
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(element => {
        element.textContent = count;
    });
}

// Add to cart
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    updateCart(cart);
    alert('Product added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    const cart = getCart().filter(item => item.productId !== productId);
    updateCart(cart);
    renderCartItems();
}

// Update cart item quantity
function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.productId === productId);

    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            updateCart(cart);
        }
    }

    renderCartItems();
}

// Render featured products on homepage
function renderFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;

    const storeData = getStoreData();
    const featuredProducts = storeData.products.filter(product => product.featured);

    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="category">${product.category}</span>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
                <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
                <a href="product-detail.html?id=${product.id}" class="btn">View Details</a>
            </div>
        </div>
    `).join('');
}

// Render all products on products page
function renderAllProducts() {
    const productsContainer = document.getElementById('all-products');
    if (!productsContainer) return;

    const storeData = getStoreData();
    const products = storeData.products;

    // Update category filter options
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        const categories = [...new Set(products.map(product => product.category))];
        categoryFilter.innerHTML = `
            <option value="all">All Categories</option>
            ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
        `;

        categoryFilter.addEventListener('change', function () {
            const selectedCategory = this.value;
            renderFilteredProducts(selectedCategory);
        });
    }

    renderFilteredProducts('all');
}

// Render filtered products based on category
function renderFilteredProducts(category) {
    const productsContainer = document.getElementById('all-products');
    if (!productsContainer) return;

    const storeData = getStoreData();
    const products = category === 'all'
        ? storeData.products
        : storeData.products.filter(product => product.category === category);

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="category">${product.category}</span>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
                <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
                <a href="product-detail.html?id=${product.id}" class="btn">View Details</a>
            </div>
        </div>
    `).join('');
}

// Render product details
function renderProductDetails() {
    const productContainer = document.getElementById('product-detail-container');
    if (!productContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        productContainer.innerHTML = '<p>Product not found</p>';
        return;
    }

    const storeData = getStoreData();
    const product = storeData.products.find(p => p.id === productId);

    if (!product) {
        productContainer.innerHTML = '<p>Product not found</p>';
        return;
    }

    productContainer.innerHTML = `
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
            <h2>${product.name}</h2>
            <p class="price">$${product.price.toFixed(2)}</p>
            <span class="category">${product.category}</span>
            <p class="description">${product.description}</p>
            <div class="quantity-selector">
                <button onclick="updateQuantity(-1)">-</button>
                <input type="number" id="product-quantity" value="1" min="1">
                <button onclick="updateQuantity(1)">+</button>
            </div>
            <button class="btn" onclick="addToCart(${product.id}, parseInt(document.getElementById('product-quantity').value))">Add to Cart</button>
        </div>
    `;
}

// Helper function for product detail quantity
function updateQuantity(change) {
    const quantityInput = document.getElementById('product-quantity');
    let quantity = parseInt(quantityInput.value) + change;
    if (quantity < 1) quantity = 1;
    quantityInput.value = quantity;
}

// Render cart items
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    if (!cartContainer) return;

    const cart = getCart();
    const storeData = getStoreData();

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty</p>';
        document.getElementById('subtotal').textContent = '0.00';
        document.getElementById('tax').textContent = '0.00';
        document.getElementById('total').textContent = '0.00';
        return;
    }

    cartContainer.innerHTML = cart.map(item => {
        const product = storeData.products.find(p => p.id === item.productId);
        if (!product) return '';

        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity">
                        <button onclick="updateCartItemQuantity(${product.id}, ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" min="1" 
                            onchange="updateCartItemQuantity(${product.id}, parseInt(this.value))">
                        <button onclick="updateCartItemQuantity(${product.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${product.id})">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    // Calculate totals
    const subtotal = cart.reduce((total, item) => {
        const product = storeData.products.find(p => p.id === item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    const taxRate = storeData.taxRate || 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

// Handle checkout
function handleCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', function () {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const storeData = getStoreData();
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            status: 'pending',
            items: cart.map(item => {
                const product = storeData.products.find(p => p.id === item.productId);
                return {
                    productId: item.productId,
                    name: product ? product.name : 'Unknown Product',
                    price: product ? product.price : 0,
                    quantity: item.quantity,
                    image: product ? product.image : ''
                };
            })
        };

        // Add order to store data
        storeData.orders.push(order);
        updateStoreData(storeData);

        // Clear cart
        updateCart([]);

        alert('Order placed successfully!');
        window.location.href = 'index.html';
    });
}

// Initialize the page based on current URL
function initPage() {
    initializeStoreData();
    updateCartCount();

    const path = window.location.pathname.split('/').pop();

    if (path === 'index.html' || path === '') {
        renderFeaturedProducts();
    } else if (path === 'products.html') {
        renderAllProducts();
    } else if (path === 'product-detail.html') {
        renderProductDetails();
    } else if (path === 'cart.html') {
        renderCartItems();
        handleCheckout();
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);