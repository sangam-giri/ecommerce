// DOM Elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');
const addProductBtn = document.getElementById('add-product-btn');
const addProductModal = document.getElementById('add-product-modal');
const orderDetailsModal = document.getElementById('order-details-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const viewOrderBtns = document.querySelectorAll('.action-btn.view');

// Toggle Sidebar
if (sidebarToggle && adminSidebar) {
    sidebarToggle.addEventListener('click', () => {
        adminSidebar.classList.toggle('active');
    });
}

// Add Product Modal
if (addProductBtn && addProductModal) {
    addProductBtn.addEventListener('click', () => {
        addProductModal.classList.add('active');
    });
}

// Order Details Modal
if (viewOrderBtns.length && orderDetailsModal) {
    viewOrderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            orderDetailsModal.classList.add('active');
        });
    });
}

// Close Modals
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

// Initialize DataTables
document.addEventListener('DOMContentLoaded', () => {
    // This would normally be replaced with actual DataTables initialization
    // For this example, we'll just simulate it

    // Add event listeners to table rows
    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', (e) => {
            // Prevent opening modal when clicking on action buttons
            if (!e.target.closest('.action-buttons')) {
                // In a real admin panel, this would navigate to the edit page
                console.log('View details for row:', row);
            }
        });
    });

    // Initialize charts if on dashboard
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
});