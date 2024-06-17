    const menu = document.getElementById('menu')
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCounter = document.getElementById('cart-count')
    const closeModalBtn = document.getElementById('close-modal-btn')
    const checkoutBtn = document.getElementById('checkout-btn');
    const adressInput = document.getElementById('adress');
    const adressWarning = document.getElementById('adress-warn');

    let cart = [];


    //Funcao mostrar e fechar modal

    function toggleElement(element) {
       if(element.style.display == 'none') {
        element.style.display = 'flex'
        updateCartModal()
       }else {
        element.style.display = 'none'
       }
    }
    cartBtn.addEventListener('click', () => toggleElement(cartModal));
    closeModalBtn.addEventListener('click', () => toggleElement(cartModal));

    cartModal.addEventListener('click', (event) => {
        if(event.target === cartModal) {
            toggleElement(cartModal);
        }
    })



    //Funcao adicionar ao carrinho

    menu.addEventListener('click', (event) => {
        parentButton = event.target.closest('.add-to-cart-btn');
        if(parentButton) {
            const name = parentButton.getAttribute('data-name');
            const price = parseFloat(parentButton.getAttribute('data-price'));

            addToCart(name, price);
        }
    })

    function addToCart(name, price) {
        const hasItem = cart.find(item => item.name === name);
        if(hasItem) {
            hasItem.quantity += 1
          
        }else {
           cart.push({
                name,
                price,
                quantity: 1,
            }) 
        }
        updateCartModal();
        

    }

    function updateCartModal() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            totalPrice += item.price * item.quantity;
            cartItemElement.innerHTML = `
                <div class="flex justify-between items-center mt-4">
                    <div>
                        <p class="font-bold">${item.name}</p>
                        <p>(quantidade: ${item.quantity})
                        <p class="font-medium my-2">R$ ${item.price}
                    </div>
                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            `
            
            cartItemsContainer.appendChild(cartItemElement);
            cartCounter.innerText = cart.length;
            cartTotal.innerHTML = totalPrice.toFixed(2);
        })
    }


    //Remover item carrinho

    cartItemsContainer.addEventListener('click', (event) => {
        const containsClass = event.target.classList.contains('remove-from-cart-btn')
        if(containsClass) {
            const name = event.target.getAttribute('data-name');
            console.log(name)
            removeItemCart(name);
        }
    })


    function removeItemCart(name){
        const index = cart.findIndex(item => item.name === name) 
        if(index !== -1) {
            const item = cart[index];

            if(item.quantity > 1) {
                item.quantity -= 1
                updateCartModal()
                return
            }
            cart.splice(index, 1);
            updateCartModal();

            
    
        }
    }

    adressInput.addEventListener('input', (event) => {
        let adressValue = event.target.value;
        
        if(adressValue !== '') {
            adressInput.classList.remove('border-red-500');
            adressWarning.classList.add('hidden');
        }
    })


    checkoutBtn.addEventListener('click', (event) => {
        const isOpen = restaurantIsOpen();
        if(!isOpen) {
            Toastify({
                text: "O restaurante está fechado!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "#EF4444",
                },
              }).showToast();
            return
        }
        if(cart.length === 0) return;

        if(adressInput.value === '') {
            adressWarning.classList.remove('hidden');
            adressInput.classList.add('border-red-500');
            return
        }

        // Enviar pedido para API whats
        const cartItems = cart.map((item) => {
            return(
                `Pedido:
                 ${item.quantity}x - ${item.name} Valor: R$${item.price} |
                `
            )
        }).join('')
        const msg = encodeURIComponent(cartItems);
        const phone = '84999580504'
        window.open(`https://wa.me/${phone}?text=${msg} Endereço: ${adressInput.value}`, '_blank');

        cart = [];
        updateCartModal();

    })


    //Verificar se o restaurante está aberto

    function restaurantIsOpen() {
        const data = new Date();
        const hour = data.getHours();

        return hour >= 18 && hour <= 22;
    }
    
    function refreshSpanItem() {
        const spanItem = document.getElementById("date-span");
        const isOpen = restaurantIsOpen();

        if(isOpen) {
            spanItem.classList.remove('bg-red-500');
            spanItem.classList.add('bg-green-500');
        
        }else {
            spanItem.classList.remove('bg-green-500');
            spanItem.classList.add('bg-red-500');
        }
    }
    refreshSpanItem();

    
    
