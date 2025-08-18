// Initialize admin panel
function initAdminPanel() {
    // Load store data
    const storeData = getStoreData();

    // Set up tab switching
    setupAdminTabs();

    // Load products
    renderAdminProducts();

    // Load orders
    renderAdminOrders();

    // Load settings
    loadStoreSettings();

    // Set up product modal
    setupProductModal();

    // Set up settings form
    setupSettingsForm();
}

// Set up admin tabs
function setupAdminTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update active content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Render products in admin panel
function renderAdminProducts() {
    const productsList = document.getElementById('admin-products-list');
    if (!productsList) return;

    const storeData = getStoreData();

    productsList.innerHTML = storeData.products.map(product => `
        <div class="product-list-item">
            <div class="product-list-item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-list-item-details">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p>Category: ${product.category}</p>
                <p>${product.featured ? '⭐ Featured' : ''}</p>
            </div>
            <div class="product-list-item-actions">
                <button class="btn" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Render orders in admin panel
function renderAdminOrders() {
    const ordersList = document.getElementById('admin-orders-list');
    if (!ordersList) return;

    const storeData = getStoreData();

    if (storeData.orders.length === 0) {
        ordersList.innerHTML = '<p>No orders found</p>';
        return;
    }

    ordersList.innerHTML = storeData.orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                <span class="order-status ${order.status === 'completed' ? 'status-completed' : 'status-pending'}">
                    ${order.status}
                </span>
            </div>
            <div class="order-products">
                ${order.items.map(item => `
                    <div class="order-product">
                        <div class="order-product-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="order-product-details">
                            <div class="order-product-name">${item.name}</div>
                            <div class="order-product-price">$${item.price.toFixed(2)}</div>
                            <div class="order-product-quantity">Qty: ${item.quantity}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: $${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </div>
            <div class="order-actions">
                ${order.status === 'pending' ? `
                    <button class="btn btn-success" onclick="completeOrder(${order.id})">Mark as Completed</button>
                ` : ''}
                <button class="btn btn-danger" onclick="deleteOrder(${order.id})">Delete Order</button>
            </div>
        </div>
    `).join('');
}

// Load store settings into form
function loadStoreSettings() {
    const storeData = getStoreData();
    document.getElementById('store-name').value = storeData.storeName;
    document.getElementById('tax-rate').value = storeData.taxRate;
}

// Set up settings form
function setupSettingsForm() {
    const form = document.getElementById('store-settings-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const storeData = getStoreData();
        storeData.storeName = document.getElementById('store-name').value;
        storeData.taxRate = parseFloat(document.getElementById('tax-rate').value);

        updateStoreData(storeData);
        alert('Settings saved successfully!');
    });
}

// Set up product modal
function setupProductModal() {
    const modal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product-btn');
    const closeModal = document.querySelector('.close-modal');

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = 'Add New Product';
            document.getElementById('product-form').reset();
            document.getElementById('product-id').value = '';
            modal.classList.add('active');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Handle form submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveProduct();
        });
    }
}

// Edit product
function editProduct(productId) {
    const storeData = getStoreData();
    const product = storeData.products.find(p => p.id === productId);

    if (!product) return;

    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-featured').checked = product.featured;

    document.getElementById('product-modal').classList.add('active');
}

// Save product (add or update)
function saveProduct() {
    const storeData = getStoreData();
    const form = document.getElementById('product-form');
    const productId = document.getElementById('product-id').value;

    const productData = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value,
        featured: document.getElementById('product-featured').checked
    };

    if (productId) {
        // Update existing product
        const index = storeData.products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            storeData.products[index] = { ...storeData.products[index], ...productData };
        }
    } else {
        // Add new product
        const newId = storeData.products.length > 0
            ? Math.max(...storeData.products.map(p => p.id)) + 1
            : 1;

        storeData.products.push({
            id: newId,
            ...productData
        });
    }

    updateStoreData(storeData);
    renderAdminProducts();
    document.getElementById('product-modal').classList.remove('active');
    alert('Product saved successfully!');
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const storeData = getStoreData();
    storeData.products = storeData.products.filter(p => p.id !== productId);

    updateStoreData(storeData);
    renderAdminProducts();
    alert('Product deleted successfully!');
}

// Complete order
function completeOrder(orderId) {
    const storeData = getStoreData();
    const order = storeData.orders.find(o => o.id === orderId);

    if (order) {
        order.status = 'completed';
        updateStoreData(storeData);
        renderAdminOrders();
        alert('Order marked as completed!');
    }
}

// Delete order
function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;

    const storeData = getStoreData();
    storeData.orders = storeData.orders.filter(o => o.id !== orderId);

    updateStoreData(storeData);
    renderAdminOrders();
    alert('Order deleted successfully!');
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdminPanel);