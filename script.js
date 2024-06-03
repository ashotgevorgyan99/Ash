
 
 
 
 // script.js
document.addEventListener('DOMContentLoaded', function() {
    const couponButton = document.getElementById('coupons');
    const menuButton = document.getElementById('menu');
    const linkButton = document.getElementById('links');
    const couponModal = document.getElementById('coupon-modal');
    const linkModal = document.getElementById('link-modal');
    const menuModal = document.getElementById('menu-modal');
    const closeButtonCoupon = document.querySelector('.close-button-coupon');
    const closeButtonLink = document.querySelector('.close-button-link');
    const closeButtonMenu = document.querySelector('.close-button-menu');
    const clickableImage = document.getElementById('clickable-image');
    const balanceElement = document.getElementById('balance');
    const cooldownElement = document.getElementById('cooldown');
    const buyCouponButton = document.getElementById('buy-coupon');
    const discountCard = document.getElementById('discount-card');
    const discountElement = document.getElementById('discount');
    const promoCodeElement = document.getElementById('promo-code');
    const expirationDateElement = document.getElementById('expiration-date');

    let balance = parseInt(balanceElement.textContent);
    let cooldownTime = 100;
    let cooldownInterval;

    function updateBalance() {
        balance += 1;
        balanceElement.textContent = balance;
    }

    function startCooldown() {
        clickableImage.classList.add('clicked');
        clickableImage.style.pointerEvents = 'none';
        let remainingTime = cooldownTime;

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
            const discount = Math.floor(Math.random() * 20) + 1;
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
        startCooldown();
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
        }
    });

    // Enlarge images in the menu modal when clicked
    const photoContainers = document.querySelectorAll('.photo-container');

    photoContainers.forEach(container => {
        container.addEventListener('click', function() {
            container.classList.toggle('enlarged');
        });
    });
});






