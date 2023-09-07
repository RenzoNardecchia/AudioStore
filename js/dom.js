const body = document.querySelector('body');
const main = document.querySelector('main');
const productContainer = document.querySelector('.productContainer');

// esta variable almacenará los datos obtenidos con fetch
let productStock = [];

// esta función muestra la descripción del producto junto con sus botones
const showDescription = (e)=>{
    let currentTarget = e.currentTarget.getAttribute('id');
    let currentProduct = productStock.find((item)=>{
        return item.name === currentTarget;
    });
    let backgroundBlocker = document.createElement('div');
    backgroundBlocker.classList.add('disableBackground');
    backgroundBlocker.addEventListener('click', removeDescription);
    backgroundBlocker.innerHTML= `
        <div class="productDescription">
            <div class="imageDescription">
                <div class="imgContainer">
                    <img src="${currentProduct.img}" alt="${currentProduct.name}">
                </div>
                <div class="description">
                    <p class="descriptionTitle">Descripción</p>
                    <p class="descriptionText">${currentProduct.description}</p>
                </div>
            </div>
            <div class="nameButtons">
                <p class="name" id="productName">${currentProduct.name}</p>
                <p class="price">$${currentProduct.price}</p>
                <label for="amount" class="amountLabel">Cantidad</label>
                <input type="number" id="amount" class="amountInput" placeholder="1" 
                value="1" min="1" required>
                <div class="buy" id="buy">Comprar</div>
                <p class="or">ó</p>
                <div class="addToCart" id="addToCart">Agregar al carrito</div>
                <div class="return">Regresar</div>
            </div>
        </div>
    `;
    main.appendChild(backgroundBlocker);
    let buyBtn = document.querySelector('#buy');
    buyBtn.addEventListener('click', ()=>{
        let purchaseChecker = addToCart();
        if(!purchaseChecker){
            Toastify({
                text: "La cantidad debe ser mayor a 1",
                duration: 1500
            }).showToast();
            return;
        }else{
            goToPurchaseScreen()
        };
    });
    let addToCartBtn = document.querySelector('#addToCart');
    addToCartBtn.addEventListener('click', ()=>{
        let purchaseChecker = addToCart();
        showProductAmount();
        // este condicional evita que se muestre el alert de "Producto agregado" cuando la cantidad
        // ingresada es menor a 1
        if(!purchaseChecker){
            Toastify({
                text: "La cantidad debe ser mayor a 1",
                duration: 1500
            }).showToast();
            return;
        };
        Toastify({
            text: "Producto agregado al carrito",
            duration: 1500
        }).showToast();
    });
}

// esta función elimina la descripción del producto junto con sus botones
const removeDescription = (e)=>{
    let backgroundBlocker = document.querySelector('.disableBackground');
    let currentTarget = e.target.getAttribute('class');
    let amount = document.querySelector('#amount').value;
    switch(currentTarget){
        case 'disableBackground':
        case 'return':
            backgroundBlocker.remove();
            break;
        case 'buy':
        case 'addToCart':
            // esto impide que se cierre la descripcion del producto si la cantidad
            // ingresada es menor a 1;
            if(amount < 1) return;
            backgroundBlocker.remove();
    }
}

// esta función se encarga de crear y mostrar todos los productos
const renderProducts = ()=>{
    for(let el of productStock){
        let productCardContainer = document.createElement('div');
        productCardContainer.classList.add('productCardContainer');
        productCardContainer.setAttribute('name', `${el.category}`);
        productCardContainer.setAttribute('id', `${el.name}`);
        productCardContainer.addEventListener('click', showDescription);
        productCardContainer.innerHTML = `
            <div class="productCard">
                <div class="img">
                    <img src=${el.img} alt="placa de sonido">
                </div>
                <div class="productCardText">
                    <p class="productName">${el.name}</p>
                    <p class="productPrice">$${el.price}</p>
                </div>
                <div class="seeMore">Ver más</div>
            </div>
        `;
        productContainer.appendChild(productCardContainer);
    }
}

// esta función elimina los productos de la pantalla
const clearScreen = ()=>{
    const productCardContainer = document.querySelectorAll('.productCardContainer');
    for(let el of productCardContainer){
        el.remove();
    }
}

// esta función se encarga de filtrar y mostrar los productos filtrados
const renderFilteredProducts = (e)=>{
    clearScreen();
    let currentCategory = e.target.getAttribute('id');
    if(currentCategory === 'todos'){
        renderProducts();
        return;
    }
    let output = productStock.filter((product)=>{
        return product.category === currentCategory;
    });
    
    for(let el of output){
        let productCardContainer = document.createElement('div');
        productCardContainer.classList.add('productCardContainer');
        productCardContainer.setAttribute('name', `${el.category}`);
        productCardContainer.setAttribute('id', `${el.name}`);
        productCardContainer.addEventListener('click', showDescription);
        productCardContainer.innerHTML = `
            <div class="productCard">
                <div class="img">
                    <img src=${el.img} alt="${el.name}">
                </div>
                <div class="productCardText">
                    <p class="productName">${el.name}</p>
                    <p class="productPrice">$${el.price}</p>
                </div>
                <div class="seeMore">Ver más</div>
            </div>
        `;
        productContainer.appendChild(productCardContainer);
    }

}

// esta variable almacena las categorías de la barra lateral
const categories = document.querySelectorAll('.individualCategory');

// y este loop les agrega su eventListener
for(let el of categories){
    el.addEventListener('click', (e)=>{
        clearScreen();
        renderFilteredProducts(e);
    })
}

// esta función crea el carrito de productos
const renderProductCart = ()=>{
    let total = calculateTotal();
    const productCartContainer = document.querySelector('.productCartContentContainer');
    const productCardsContainer = document.createElement('div');
    productCardsContainer.classList.add('productCardsContainer');
    productCartContainer.appendChild(productCardsContainer);
    
    // este condicional muestra un mensaje cuando el carrito está vacío
    if(productCart.length === 0){
        productCartContainer.textContent = 'Tu carrito está vacío :(';
        return;
    }
    for(let el of productCart){
        productCardsContainer.innerHTML += `
        <div class="miniProductCard" id="${el.name}">
                <div class="miniProductCardMain">
                    <p class="miniProductCardName">${el.name}</p>
                    <div class="buttonsAndTotal">
                        <div class="miniProductCardButtonsContainer">
                            <img src="images/less.png" alt="" class="miniProductCardButtons" name="less" id="${productCart.indexOf(el)}">
                            <p class="miniProductCardAmount">${el.amount}</p>
                            <img src="images/more.png" alt="" class="miniProductCardButtons" name="more" id="${productCart.indexOf(el)}">
                        </div>
                        <p class="miniProductCardTotal">$${el.total}</p>
                    </div>
                </div>
                <img src="images/delete.png" alt="" class="miniProductCardDelete" id="${productCart.indexOf(el)}">
            </div>
        `;
    }
    // aquí añado el total y el botón comprar y vaciar carrito
    productCartContainer.innerHTML+=`
    <div class="productCartTotal">
        <p class="productCartTotalText">TOTAL</p>
        <p class="productCartTotalText">$${total}</p>
    </div>
    <div class="productCartMainButtons">
        <div class="miniClear">Vaciar carrito</div>
        <div class="miniBuy">Comprar</div>
    </div>
    `;
    let miniBuyBtn = document.querySelector('.miniBuy');
    miniBuyBtn.addEventListener('click', goToPurchaseScreen);

    let miniClearBtn = document.querySelector('.miniClear');
    miniClearBtn.addEventListener('click', ()=>{
        Swal.fire({
            title: 'Está seguro?',
            text: `Va a eliminar todos los productos de su carrito`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Vaciar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                productCart = [];
                clearProductCart();
                renderProductCart();
                showProductAmount();
            }
        })
    });
    // aquí añado los botones de las mini cards
    addDeleteButton();
    addAmountButtons();
}

// esta variable almacena el botón del carrito de compras
const productCartBtn = document.querySelector('.productCartContainer');
productCartBtn.addEventListener('click', ()=>{
    let productCartContainer = document.querySelector('.productCartContentContainer');
    productCartContainer.classList.toggle('hidden');
    clearProductCart();
    renderProductCart();
});

// esta función elimina el contenido del product cart
const clearProductCart = ()=>{
    const productCartContainer = document.querySelector('.productCartContentContainer');
    productCartContainer.textContent='';
}

// esta función agrega un eventListener a los botones "delete" del carrito de compras
const addDeleteButton=()=>{
    let deleteBtn = document.querySelectorAll('.miniProductCardDelete');
    for(let el of deleteBtn){
        el.addEventListener('click', deleteMiniProductCard);
    }
}

// esta función agrega un eventListener a los botones "-" y "+" del carrito de compras
const addAmountButtons=()=>{
    let moreBtn = document.getElementsByName('more');
    for(let el of moreBtn){
        el.addEventListener('click', (e)=>{
            increaseAmount(e);
            showProductAmount();
        });
    }

    let lessBtn = document.getElementsByName('less');
    for(let el of lessBtn){
        el.addEventListener('click', (e)=>{
            reduceAmount(e);
            showProductAmount();
        });
    }
}

// esta función elimina el producto seleccionado
const deleteMiniProductCard = (e)=>{
    removeFromCart(e);
    saveProductCartStorage(productCart);
    clearProductCart();
    renderProductCart();
    Toastify({
        text: "Producto eliminado",
        duration: 1500
    }).showToast();
    showProductAmount();
}

const showProductAmount = ()=>{
    let el = document.querySelector('.amountIcon');
    if(el){
        el.textContent = productCart.reduce((acc, item) => acc + item.amount, 0);
    } else{
        const productCartContainer = document.querySelector('.productCartContainer');
        const amountIcon = document.createElement('div');
        amountIcon.classList.add('amountIcon');
        amountIcon.textContent = productCart.reduce((acc, item) => acc + item.amount, 0);
        productCartContainer.appendChild(amountIcon);
    }
    if(productCart.length<1){
        let element = document.querySelector('.amountIcon');
        element.remove();
        return;
    }
}

// esta función envía al usuario a la página de confirmación de compra
const goToPurchaseScreen = ()=>{
    window.location.href = "purchaseScreen.html";
}

fetch('js/stock.json')
    .then(response => response.json())
    .then(data =>{
        productStock = [...data];
        renderProducts();
    })
    // .then(() => renderProducts());

showProductAmount();

