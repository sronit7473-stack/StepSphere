document.addEventListener('DOMContentLoaded', function () {
    // Cart state
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Elements
    const cartIcon = document.querySelector('.icons .fa-shopping-cart');
    const cartModal = document.querySelector('.cart-modal');
    const addToCartButtons = document.querySelectorAll('.btn-cart');

    // Create cart badge if it doesn't exist
    let cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) {
        cartBadge = document.createElement('span');
        cartBadge.className = 'cart-badge';
        Object.assign(cartBadge.style, {
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#e74c3c',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
        });3

        if (cartIcon) {
            cartIcon.parentNode.style.position = 'relative';
            cartIcon.parentNode.appendChild(cartBadge);
        }
    }

    updateCartBadge();

    // Add to Cart popup
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h3>Thank You!</h3>
            <p>Item has been added to cart successfully</p>
        </div>
    `;
    document.body.appendChild(popup);

    // Add to Cart logic
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();

                const productCard = this.closest('.product-card');
                if (!productCard) return;

                const productTitle = productCard.querySelector('.product-title')?.textContent || 'Unknown Product';
                const productPrice = productCard.querySelector('.product-price')?.textContent || '$0.00';
                const productImage = productCard.querySelector('.product-image img')?.src || '';

                const newItem = {
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    quantity: 1,
                    id: Date.now()
                };

                const existingItemIndex = cartItems.findIndex(item => item.title === productTitle);
                if (existingItemIndex > -1) {
                    cartItems[existingItemIndex].quantity += 1;
                } else {
                    cartItems.push(newItem);
                }

                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartBadge();

                if (cartIcon) {
                    cartIcon.classList.add('cart-bounce');
                    setTimeout(() => {
                        cartIcon.classList.remove('cart-bounce');
                    }, 500);
                }

                popup.classList.add('open-popup');
                setTimeout(() => {
                    popup.classList.remove('open-popup');
                }, 1000);
            });
        });
    } else {
        console.warn('No Add to Cart buttons found.');
    }

    // Open Cart Modal
    if (cartIcon) {
        cartIcon.parentNode.style.cursor = 'pointer';
        cartIcon.parentNode.addEventListener('click', function () {
            if (cartModal) {
                updateCartModal();
                cartModal.style.display = 'block';
                cartModal.classList.add('open-cart-modal');
            } else {
                if (cartItems.length === 0) {
                    alert('Your cart is empty');
                } else {
                    const itemsList = cartItems.map(item =>
                        `${item.title} - ${item.quantity} x ${item.price}`
                    ).join('\n');
                    alert(`Your Cart:\n\n${itemsList}\n\nTotal Items: ${getTotalItems()}`);
                }
            }
        });
    }

    // Close Cart Modal
    const closeCartModalBtn = document.querySelector('.close-cart-modal');
    if (closeCartModalBtn) {
        closeCartModalBtn.addEventListener('click', function () {
            if (cartModal) {
                cartModal.style.display = 'none';
                cartModal.classList.remove('open-cart-modal');
            }
        });
    }

    // Update badge
    function updateCartBadge() {
        const totalItems = getTotalItems();
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Update Cart Modal
    function updateCartModal() {
        const cartItemsContainer = document.querySelector('.cart-items-container');
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
            return;
        }

        cartItems.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        const cartTotal = document.querySelector('.cart-total span');
        if (cartTotal) {
            cartTotal.textContent = `${getTotalItems()} items`;
        }

        addRemoveButtonListeners();
    }

    // Remove item logic
    function addRemoveButtonListeners() {
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = parseInt(this.dataset.id);
                const index = cartItems.findIndex(item => item.id === id);
                if (index > -1) {
                    cartItems.splice(index, 1);
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    updateCartBadge();
                    updateCartModal();
                }
            });
        });
    }

    function getTotalItems() {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }
});
