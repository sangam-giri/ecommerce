// Initialize admin panel
function initAdminPanel() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Initialize empty store data if none exists
    if (!localStorage.getItem('shopEasyStore')) {
        const emptyStoreData = {
            storeName: 'ShopEasy',
            taxRate: 8.5,
            currencySymbol: '$',
            products: [],
            orders: []
        };
        localStorage.setItem('shopEasyStore', JSON.stringify(emptyStoreData));
    }

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

    // Add first product button
    const addFirstProductBtn = document.getElementById('add-first-product');
    if (addFirstProductBtn) {
        addFirstProductBtn.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = 'Add New Product';
            document.getElementById('product-form').reset();
            document.getElementById('product-id').value = '';
            document.getElementById('product-modal').classList.add('active');
        });
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

    if (storeData.products.length === 0) {
        productsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No Products Found</h3>
                <p>Add your first product to get started</p>
                <button id="add-first-product" class="btn"><i class="fas fa-plus"></i> Add Product</button>
            </div>
        `;

        // Add event listener to the button
        const addFirstProductBtn = document.getElementById('add-first-product');
        if (addFirstProductBtn) {
            addFirstProductBtn.addEventListener('click', () => {
                document.getElementById('modal-title').textContent = 'Add New Product';
                document.getElementById('product-form').reset();
                document.getElementById('product-id').value = '';
                document.getElementById('product-modal').classList.add('active');
            });
        }
        return;
    }

    productsList.innerHTML = storeData.products.map(product => `
        <div class="product-list-item">
            <div class="product-list-item-image">
                <img src="${product.image || 'https://via.placeholder.com/150?text=No+Image'}" alt="${product.name}">
            </div>
            <div class="product-list-item-details">
                <h3>${product.name}</h3>
                <p class="price">${storeData.currencySymbol || '$'}${product.price.toFixed(2)}</p>
                <span class="category">${product.category}</span>
                ${product.featured ? '<span class="featured"><i class="fas fa-star"></i> Featured</span>' : ''}
            </div>
            <div class="product-list-item-actions">
                <button class="btn btn-sm" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i> Delete</button>
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
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No Orders Found</h3>
                <p>Orders will appear here when customers make purchases</p>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = storeData.orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                <span class="order-status ${order.status === 'completed' ? 'status-completed' : 'status-pending'}">
                    <i class="fas ${order.status === 'completed' ? 'fa-check-circle' : 'fa-clock'}"></i>
                    ${order.status}
                </span>
            </div>
            <div class="order-products">
                ${order.items.map(item => `
                    <div class="order-product">
                        <div class="order-product-image">
                            <img src="${item.image || 'https://via.placeholder.com/150?text=No+Image'}" alt="${item.name}">
                        </div>
                        <div class="order-product-details">
                            <div class="order-product-name">${item.name}</div>
                            <div class="order-product-price">${storeData.currencySymbol || '$'}${item.price.toFixed(2)}</div>
                            <div class="order-product-quantity">Qty: ${item.quantity}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: ${storeData.currencySymbol || '$'}${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </div>
            <div class="order-actions">
                ${order.status === 'pending' ? `
                    <button class="btn btn-success" onclick="completeOrder(${order.id})"><i class="fas fa-check"></i> Mark as Completed</button>
                ` : ''}
                <button class="btn btn-danger" onclick="deleteOrder(${order.id})"><i class="fas fa-trash"></i> Delete Order</button>
            </div>
        </div>
    `).join('');
}

// Load store settings into form
function loadStoreSettings() {
    const storeData = getStoreData();
    document.getElementById('store-name').value = storeData.storeName || 'ShopEasy';
    document.getElementById('tax-rate').value = storeData.taxRate || 8.5;
    document.getElementById('currency-symbol').value = storeData.currencySymbol || '$';
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
        storeData.currencySymbol = document.getElementById('currency-symbol').value;

        updateStoreData(storeData);

        // Show success message
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Set up product modal
function setupProductModal() {
    const modal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product-btn');
    const closeModal = document.querySelector('.close-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    // Add product button
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = 'Add New Product';
            document.getElementById('product-form').reset();
            document.getElementById('product-id').value = '';
            document.getElementById('image-preview-container').style.display = 'none';
            document.getElementById('image-name').textContent = 'No image selected';
            modal.classList.add('active');
        });
    }

    // Close modal buttons
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Image upload handling
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('product-image-upload');
    const imageName = document.getElementById('image-name');
    const imagePreview = document.getElementById('image-preview');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imageUrlInput = document.getElementById('product-image-url');

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            imageName.textContent = file.name;

            // Create a local URL for the image preview
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';

                // Store the image data URL for saving
                imageUrlInput.value = e.target.result;
            }
            reader.readAsDataURL(file);
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
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-featured').checked = product.featured || false;

    // Handle image
    const imagePreview = document.getElementById('image-preview');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imageUrlInput = document.getElementById('product-image-url');
    const imageName = document.getElementById('image-name');

    if (product.image) {
        imagePreview.src = product.image;
        imagePreviewContainer.style.display = 'block';
        imageUrlInput.value = product.image;
        imageName.textContent = 'Image selected';
    } else {
        imagePreviewContainer.style.display = 'none';
        imageUrlInput.value = '';
        imageName.textContent = 'No image selected';
    }

    document.getElementById('product-modal').classList.add('active');
}

// Save product (add or update)
function saveProduct() {
    const storeData = getStoreData();
    const form = document.getElementById('product-form');
    const productId = document.getElementById('product-id').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    const productData = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image-url').value,
        description: document.getElementById('product-description').value,
        featured: document.getElementById('product-featured').checked
    };

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
        alert('Please fill in all required fields');
        return;
    }

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    // Simulate async save (in a real app, this would be an API call)
    setTimeout(() => {
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

        // Reset form and close modal
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';

        setTimeout(() => {
            form.reset();
            document.getElementById('product-modal').classList.remove('active');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Refresh products list
            renderAdminProducts();
        }, 1000);
    }, 1000);
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    const storeData = getStoreData();
    storeData.products = storeData.products.filter(p => p.id !== productId);

    updateStoreData(storeData);
    renderAdminProducts();

    // Show notification
    showNotification('Product deleted successfully', 'success');
}

// Complete order
function completeOrder(orderId) {
    const storeData = getStoreData();
    const order = storeData.orders.find(o => o.id === orderId);

    if (order) {
        order.status = 'completed';
        updateStoreData(storeData);
        renderAdminOrders();
        showNotification('Order marked as completed', 'success');
    }
}

// Delete order
function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    const storeData = getStoreData();
    storeData.orders = storeData.orders.filter(o => o.id !== orderId);

    updateStoreData(storeData);
    renderAdminOrders();
    showNotification('Order deleted successfully', 'success');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
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

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdminPanel);