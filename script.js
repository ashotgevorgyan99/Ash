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
    const cooldownElement = document.querySelector('.cooldown');
    const buyCouponButton = document.getElementById('buy-coupon');
    const discountCard = document.getElementById('discount-card');
    const discountElement = document.getElementById('discount');
    const promoCodeElement = document.getElementById('promo-code');
    const expirationDateElement = document.getElementById('expiration-date');
    const setPriceElement = document.getElementById('set-price').querySelector('span');
    const confirmBuySetButton = document.getElementById('confirm-buy-set');
    const loadingProgressElement = document.getElementById('loading-progress');
    let selectedSetImage = '';
    let selectedSetPrice = '';
    let promoCode = '';
    let expirationDate = '';

    let balance = parseInt(localStorage.getItem('balance')) || 0;
    balanceElement.textContent = balance;

    const cooldownTime = 100; // <- Ժամանակը փոփոխելու տեղ համար 1:
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

    function updateBalance(amount) {
        balance += amount;
        balanceElement.textContent = balance;
        localStorage.setItem('balance', balance); // Save balance to localStorage
    }

    function startCooldown(remainingTime) {
        clickableImage.classList.add('clicked');
        clickableImage.style.pointerEvents = 'none';

        cooldownInterval = setInterval(function() {
            remainingTime--;
            const percentage = ((cooldownTime - remainingTime) / cooldownTime) * 100;
            loadingProgressElement.style.width = percentage + '%';
            loadingProgressElement.textContent = remainingTime;

            if (remainingTime <= 0) {
                clearInterval(cooldownInterval);
                clickableImage.classList.remove('clicked');
                clickableImage.style.pointerEvents = 'auto';
                loadingProgressElement.style.width = '0%';
                loadingProgressElement.textContent = '';
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
        currentDate.setDate(currentDate.getDate() + 3); // Կտրոնի վավերականության ժամկետը փոփոխելու տեղ:
        return currentDate.toISOString().split('T')[0];
    }

    function buyCoupon() {
        if (balance >= 100) {
            updateBalance(-100); // Կտրոնի արժեքը փոփոխելու տեղ:
            const discount = Math.floor(Math.random() * 16) + 5; // Զեղչը փոփոխելու տեղ:
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

    buyCouponButton.addEventListener('click', buyCoupon);

    clickableImage.addEventListener('click', function() {
        updateBalance(1); // Միավորները ավելացնելու տեղ:
        startCooldown(cooldownTime);
        localStorage.setItem('lastClickTimestamp', Date.now()); // Save the current timestamp to localStorage
    });

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
                        <p>40% զեղչի կտրոնը - <img src="coin.png" alt=""> 1000</p>
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
        if (balance >= 1000) {
            updateBalance(-1000); // Սեթի արժեքը փոփոխելու տեղ:

            // Generate promo code and expiration date
            promoCode = generateRandomPromoCode();
            expirationDate = calculateExpirationDate();

            // Update modal content with purchase details
            buySetModal.querySelector('.modal-content').innerHTML = `
                <h2>Կտրոն</h2>
                <p>դուք ունեք 40% զեղչ տվյալ սեթի համար </p>
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

    // Get the modal
    var newsModal = document.getElementById("news-modal");

    // Get the button that opens the modal
    var newsBtn = document.getElementById("news-modal-button");

// Get the <span> element that closes the modal
    var closeNewsButton = document.getElementsByClassName("close-button-news")[0];

    // When the user clicks the button, open the modal 
    newsBtn.onclick = function() {
        newsModal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    closeNewsButton.onclick = function() {
        newsModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == newsModal) {
            newsModal.style.display = "none";
        }
    }

    // Setup for the spin functionality
    const spinImage = document.getElementById('spinning-image');
    const spinModal = document.getElementById('spin-modal');
    const closeSpinButton = document.querySelector('.close-button-spin');
    const startButton = document.getElementById('start-button');
    const number1Element = document.getElementById('number1');
    const number2Element = document.getElementById('number2');
    const number3Element = document.getElementById('number3');
    const messageElement = document.getElementById('message');
    const timerElement = document.getElementById('timer');
    const timeRemainingElement = document.getElementById('time-remaining');

    spinImage.addEventListener('click', function() {
        spinModal.style.display = 'block';
    });

    closeSpinButton.addEventListener('click', function() {
        spinModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == spinModal) {
            spinModal.style.display = 'none';
        }
    });

    const cooldownTimeSpin = 0 * 60 * 60 * 1000; // Սլոտի ժամանակը փոփոխելու տեղ:
    let lastClickTimestampSpin = parseInt(localStorage.getItem('lastClickTimestampSpin')) || 0;

    function updateTimer() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastClickTimestampSpin;
        const remainingTime = cooldownTimeSpin - elapsedTime;

        if (remainingTime > 0) {
            startButton.disabled = true;
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            timeRemainingElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            const percentage = (elapsedTime / cooldownTimeSpin) * 100;
            timerElement.style.background = `conic-gradient(#3498db ${percentage}%, #ecf0f1 ${percentage}%)`;
        } else {
            startButton.disabled = false;
            timeRemainingElement.textContent = '00:00:00';
            timerElement.style.background = '#3498db';
        }
    }

    setInterval(updateTimer, 1000);

    startButton.addEventListener('click', function() {
        const currentTime = Date.now();
        lastClickTimestampSpin = currentTime;
        localStorage.setItem('lastClickTimestampSpin', lastClickTimestampSpin);

        const probability = Math.random();
        let num1, num2, num3;

        if (probability < 0.2) {
            // 20% chance to match
            num1 = num2 = num3 = Math.floor(Math.random() * 10);
        } else {
            // 80% chance to not match
            num1 = Math.floor(Math.random() * 10);
            num2 = Math.floor(Math.random() * 10);
            num3 = Math.floor(Math.random() * 10);
            // Ensure numbers do not match
            while (num1 === num2) {
                num2 = Math.floor(Math.random() * 10);
            }
            while (num1 === num3 || num2 === num3) {
                num3 = Math.floor(Math.random() * 10);
            }
        }

        number1Element.textContent = num1;
        number2Element.textContent = num2;
        number3Element.textContent = num3;

        if (num1 === num2 && num2 === num3) {
            updateBalance(30); // Add 30 points to the balance
            messageElement.textContent = 'Դուք Շահեցիք 30 միավոր';
        } else {
            messageElement.textContent = 'Փորձեք կրկին';
        }

        updateTimer();
    });

    // Function to handle click event on clickable image
    clickableImage.addEventListener('click', function() {
        updateBalance(0); // Increase balance by 1 point per click
         // Save the current timestamp to localStorage
    });

    // Initial update of balance from local storage
    balanceElement.textContent = balance;
});
    
