document.addEventListener('DOMContentLoaded', function() {
    const couponButton = document.getElementById('coupons');
    const menuButton = document.getElementById('menu');
    const linkButton = document.getElementById('links');
    const couponModal = document.getElementById('coupon-modal');
    const linkModal = document.getElementById('link-modal');
    const menuModal = document.getElementById('menu-modal');
    const buySetModal = document.getElementById('buy-set-modal');
    const closeButtonCoupon = document.querySelector('.close-button-coupon');
    const closeButtonLink = document.querySelector('.close-button-link');
    const closeButtonMenu = document.querySelector('.close-button-menu');
    const closeButtonBuySet = document.querySelector('.close-button-buy-set');
    const clickableImage = document.getElementById('clickable-image');
    const balanceElement = document.getElementById('balance');
    const cooldownElement = document.getElementById('cooldown');
    const buyCouponButton = document.getElementById('buy-coupon');
    const discountCard = document.getElementById('discount-card');
    const discountElement = document.getElementById('discount');
    const promoCodeElement = document.getElementById('promo-code');
    const expirationDateElement = document.getElementById('expiration-date');
    const setPriceElement = document.getElementById('set-price').querySelector('span');
    const confirmBuySetButton = document.getElementById('confirm-buy-set');
    let selectedSetImage = '';
    let selectedSetPrice = '';
    let promoCode = '';
    let expirationDate = '';

    let balance = 0;
    const storedBalance = parseInt(localStorage.getItem('balance')) || 0;
    const isFirstVisit = localStorage.getItem('isFirstVisit') === null;

    // If it's the first visit, set balance to 0 and store the flag
    if (isFirstVisit) {
        localStorage.setItem('balance', 0);
        localStorage.setItem('isFirstVisit', 'false');
        balanceElement.textContent = 0;
    } else {
        balance = storedBalance;
        balanceElement.textContent = balance;
    }

    const cooldownTime = 100;
    let cooldownInterval;

    // Check and apply the remaining cooldown time on page load
    const lastClickTimestamp = parseInt(localStorage.getItem('lastClickTimestamp'));
    if (lastClickTimestamp) {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - lastClickTimestamp) / 1000);
        if (elapsedTime < cooldownTime) {
            startCooldown(cooldownTime - elapsedTime);
        }
    }

    function updateBalance() {
        balance += 1;
        balanceElement.textContent = balance;
        localStorage.setItem('balance', balance); // Save balance to localStorage
    }

    function startCooldown(remainingTime) {
        clickableImage.classList.add('clicked');
        clickableImage.style.pointerEvents = 'none';

        cooldownInterval = setInterval(function() {
            remainingTime--;
            cooldownElement.textContent = remainingTime;

            if (remainingTime <= 0) {
                clearInterval(cooldownInterval);
                clickableImage.classList.remove('clicked');
                clickableImage.style.pointerEvents = 'auto';
                cooldownElement.textContent = cooldownTime;
            }
        }, 1000);
    }

    function generateRandomPromoCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let promoCode = '';
        for (let i = 0; i < 7; i++) {
            promoCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return promoCode;
    }

    function calculateExpirationDate() {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        return currentDate.toISOString().split('T')[0];
    }

    function buyCoupon() {
        if (balance >= 100) {
            balance -= 100;
            balanceElement.textContent = balance;
            localStorage.setItem('balance', balance); // Save balance to localStorage
            const discount = Math.floor(Math.random() * 16) + 5;
            const promoCode = generateRandomPromoCode();
            const expirationDate = calculateExpirationDate();
            discountElement.textContent = discount;
            promoCodeElement.textContent = promoCode;
            expirationDateElement.textContent = expirationDate;
            discountCard.classList.remove('hidden');
        } else {
            alert('հաշվին չկա բավարար միջոցներ.');
        }
    }

    clickableImage.addEventListener('click', function() {
        updateBalance();
        startCooldown(cooldownTime);
        localStorage.setItem('lastClickTimestamp', Date.now()); // Save the current timestamp to localStorage
    });

    buyCouponButton.addEventListener('click', buyCoupon);

    couponButton.addEventListener('click', function() {
        couponModal.style.display = 'block';
    });

    closeButtonCoupon.addEventListener('click', function() {
        couponModal.style.display = 'none';
    });

    menuButton.addEventListener('click', function() {
        menuModal.style.display = 'block';
    });

    closeButtonMenu.addEventListener('click', function() {
        menuModal.style.display = 'none';
    });

    linkButton.addEventListener('click', function() {
        linkModal.style.display = 'block';
    });

    closeButtonLink.addEventListener('click', function() {
        linkModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == couponModal) {
            couponModal.style.display = 'none';
        } else if (event.target == linkModal) {
            linkModal.style.display = 'none';
        } else if (event.target == menuModal) {
            menuModal.style.display = 'none';
        } else if (event.target == buySetModal) {
            buySetModal.style.display = 'none';
        }
    });

    // Enlarge images in the menu modal when clicked
    const photoContainers = document.querySelectorAll('.photo-container');

    photoContainers.forEach(container => {
        container.addEventListener('click', function() {
            container.classList.toggle('enlarged');

            if (container.classList.contains('enlarged')) {
                // Display the buy set button
                const buyButton = document.createElement('button');
                buyButton.innerText = 'Գնել Սեթը';
                buyButton.className = 'buy-set-button';
                container.appendChild(buyButton);

                buyButton.addEventListener('click', function() {
                    selectedSetImage = container.querySelector('img').src;
                    selectedSetPrice = container.querySelector('.caption').innerText;
                    buySetModal.style.display = 'block';
                    // Update modal with selected set details
                    buySetModal.querySelector('.modal-content').innerHTML = `
                        <h2>Գնել Սեթը</h2>
                        <p>1 զեղչի կտրոնը - <img src="coin.png" alt=""> 5000</p>
                        <img src="${selectedSetImage}" alt="Selected Set" style="width: 150px; height: 150px;">
                        <button id="confirm-buy-set" class="confirm-button">Հաստատել</button>
                        <button class="close-button close-button-buy-set">&times;</button>
                    `;
                    document.querySelector('.close-button-buy-set').addEventListener('click', function() {
                        buySetModal.style.display = 'none';
                    });
                    document.getElementById('confirm-buy-set').addEventListener('click', confirmPurchase);
                });
            } else {
                // Remove the buy set button
                const buyButton = container.querySelector('.buy-set-button');
                if (buyButton) {
                    container.removeChild(buyButton);
                }
            }
        });
    });

    function confirmPurchase() {
        if (balance >= 5000) {
            balance -= 5000;
            balanceElement.textContent = balance;
            localStorage.setItem('balance', balance); // Save balance to localStorage

            // Generate promo code and expiration date
            promoCode = generateRandomPromoCode();
            expirationDate = calculateExpirationDate();

            // Update modal content with purchase details
            buySetModal.querySelector('.modal-content').innerHTML = `
                <h2>Կտրոն</h2>
                <p>1 զեղչի կտրոնը - <img src="coin.png" alt=""> 5000</p>
                <img src="${selectedSetImage}" alt="Purchased Set" style="width: 150px; height: 150px;">
                <p>( Промо-код ): ${promoCode}</p>
                <p>կտրոնի վավերականության ժամկետը: ${expirationDate}</p>
                <button class="close-button close-button-buy-set">&times;</button>
            `;
            document.querySelector('.close-button-buy-set').addEventListener('click', function() {
                buySetModal.style.display = 'none';
            });
        } else {
            alert('հաշվին չկա բավարար միավոր.');
        }
    }

    closeButtonBuySet.addEventListener('click', function() {
        buySetModal.style.display = 'none';
    });
});
