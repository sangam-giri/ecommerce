// DOM Elements
const adminLoginLink = document.getElementById('admin-login-link');
const featuredProductsGrid = document.getElementById('featured-products');
const allProductsGrid = document.getElementById('all-products');
const relatedProductsGrid = document.getElementById('related-products');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const ratingStars = document.querySelectorAll('.rating-input i');
const quantityDecrease = document.querySelector('.quantity-option .decrease');
const quantityIncrease = document.querySelector('.quantity-option .increase');
const quantityInput = document.querySelector('.quantity-option input');
const checkoutSteps = document.querySelectorAll('.checkout-steps .step');
const shippingForm = document.getElementById('shipping-form');
const paymentForm = document.getElementById('payment-form');
const confirmationSection = document.getElementById('confirmation');
const placeOrderBtn = document.getElementById('place-order');

// Sample Product Data
const products = [
    {
        id: 1,
        name: 'Premium Wireless Headphones',
        category: 'Electronics',
        price: 199.99,
        oldPrice: 249.99,
        image: 'images/product1.jpg',
        rating: 4.5,
        reviews: 24,
        featured: true
    },
    {
        id: 2,
        name: 'Smart Fitness Tracker',
        category: 'Electronics',
        price: 89.99,
        image: 'images/product2.jpg',
        rating: 4.2,
        reviews: 18,
        featured: true
    },
    {
        id: 3,
        name: 'Organic Cotton T-Shirt',
        category: 'Fashion',
        price: 29.99,
        image: 'images/product3.jpg',
        rating: 4.7,
        reviews: 32,
        featured: true
    },
    {
        id: 4,
        name: 'Stainless Steel Water Bottle',
        category: 'Home',
        price: 24.99,
        oldPrice: 34.99,
        image: 'images/product4.jpg',
        rating: 4.8,
        reviews: 15,
        featured: true
    },
    {
        id: 5,
        name: 'Wireless Charging Pad',
        category: 'Electronics',
        price: 39.99,
        image: 'images/product5.jpg',
        rating: 4.3,
        reviews: 12
    },
    {
        id: 6,
        name: 'Bluetooth Speaker',
        category: 'Electronics',
        price: 79.99,
        image: 'images/product6.jpg',
        rating: 4.6,
        reviews: 21
    },
    {
        id: 7,
        name: 'Yoga Mat',
        category: 'Sports',
        price: 34.99,
        image: 'images/product7.jpg',
        rating: 4.4,
        reviews: 8
    },
    {
        id: 8,
        name: 'Leather Wallet',
        category: 'Fashion',
        price: 49.99,
        image: 'images/product8.jpg',
        rating: 4.9,
        reviews: 14
    }
];

// Initialize Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Admin Login Link
if (adminLoginLink) {
    adminLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'admin/index.html';
    });
}

// Display Featured Products
function displayFeaturedProducts() {
    if (featuredProductsGrid) {
        const featuredProducts = products.filter(product => product.featured);
        featuredProductsGrid.innerHTML = featuredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.oldPrice ? `<span class="product-badge">Sale</span>` : ''}
                    <div class="product-actions">
                        <button class="add-to-wishlist"><i class="far fa-heart"></i></button>
                        <button class="quick-view"><i class="far fa-eye"></i></button>
                        <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% Off</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${generateRatingStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Display All Products
function displayAllProducts() {
    if (allProductsGrid) {
        allProductsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.oldPrice ? `<span class="product-badge">Sale</span>` : ''}
                    <div class="product-actions">
                        <button class="add-to-wishlist"><i class="far fa-heart"></i></button>
                        <button class="quick-view"><i class="far fa-eye"></i></button>
                        <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% Off</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${generateRatingStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Display Related Products
function displayRelatedProducts() {
    if (relatedProductsGrid) {
        const relatedProducts = products.slice(0, 4); // Just getting first 4 as related
        relatedProductsGrid.innerHTML = relatedProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.oldPrice ? `<span class="product-badge">Sale</span>` : ''}
                    <div class="product-actions">
                        <button class="add-to-wishlist"><i class="far fa-heart"></i></button>
                        <button class="quick-view"><i class="far fa-eye"></i></button>
                        <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% Off</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${generateRatingStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Generate Rating Stars
function generateRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }

    return stars;
}

// Tab Switching
if (tabButtons.length && tabPanes.length) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update active tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Rating Stars Interaction
if (ratingStars.length) {
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));

            // Update star display
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('fas', 'fa-star');
                    s.classList.remove('far', 'fa-star-half-alt');
                } else {
                    s.classList.add('far', 'fa-star');
                    s.classList.remove('fas', 'fa-star-half-alt');
                }
            });
        });
    });
}

// Quantity Selector
if (quantityDecrease && quantityIncrease && quantityInput) {
    quantityDecrease.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    quantityIncrease.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });
}

// Add to Cart
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
        const productId = parseInt(button.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);

        if (product) {
            addToCart(product);
            updateCartCount();

            // Show notification
            showNotification(`${product.name} added to cart!`);
        }
    }
});

// Add to Cart Function
function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Checkout Steps
if (checkoutSteps.length && shippingForm && paymentForm && confirmationSection && placeOrderBtn) {
    // Step 1: Shipping form submission
    shippingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Move to step 2
        checkoutSteps[0].classList.remove('active');
        checkoutSteps[1].classList.add('active');

        shippingForm.style.display = 'none';
        paymentForm.style.display = 'block';
    });

    // Place order button
    placeOrderBtn.addEventListener('click', () => {
        // Move to step 3
        checkoutSteps[1].classList.remove('active');
        checkoutSteps[2].classList.add('active');

        paymentForm.style.display = 'none';
        confirmationSection.style.display = 'block';

        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayFeaturedProducts();
    displayAllProducts();
    displayRelatedProducts();
    updateCartCount();

    // Add event listeners to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(button.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);

            if (product) {
                addToCart(product);
                updateCartCount();

                // Show notification
                showNotification(`${product.name} added to cart!`);
            }
        });
    });

    // Quick view buttons
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            alert(`Quick view of ${productName}`);
        });
    });

    // Add to wishlist buttons
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            showNotification(`${productName} added to wishlist!`);
        });
    });
});

// Admin Dashboard Charts
if (document.getElementById('salesChart')) {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales',
                data: [12000, 15000, 18000, 14000, 16000, 19000, 22000, 20000, 23000, 21000, 24000, 25000],
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderColor: '#3498db',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'],
            datasets: [{
                data: [35, 25, 20, 10, 10],
                backgroundColor: [
                    '#3498db',
                    '#e74c3c',
                    '#2ecc71',
                    '#f39c12',
                    '#9b59b6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            cutout: '70%'
        }
    });
}

// Admin Panel Toggle
const sidebarToggle = document.querySelector('.sidebar-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');

if (sidebarToggle && adminSidebar) {
    sidebarToggle.addEventListener('click', () => {
        adminSidebar.classList.toggle('active');
    });
}

// Admin Add Product Modal
const addProductBtn = document.getElementById('add-product-btn');
const addProductModal = document.getElementById('add-product-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');

if (addProductBtn && addProductModal) {
    addProductBtn.addEventListener('click', () => {
        addProductModal.classList.add('active');
    });
}

if (closeModalBtns.length) {
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Image Upload Preview
const imageUpload = document.querySelector('.image-upload');
const uploadPreview = document.querySelector('.upload-preview');

if (imageUpload && uploadPreview) {
    const fileInput = imageUpload.querySelector('input[type="file"]');

    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        uploadPreview.innerHTML = '';

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file.type.match('image.*')) continue;

            const reader = new FileReader();

            reader.onload = (function (theFile) {
                return function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.title = theFile.name;
                    uploadPreview.appendChild(img);
                };
            })(file);

            reader.readAsDataURL(file);
        }
    });
}