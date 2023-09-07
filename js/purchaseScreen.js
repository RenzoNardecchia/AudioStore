let mainContainer = document.querySelector('.description');
// esta función recorre el array productCart y muestra el detalle de compra
const renderProductDetails = (discountCodeChecker)=>{
    let total = calculateTotal();
    let container = document.querySelector('.descriptionTextContainer');
    for(let el of productCart){
        container.innerHTML+=`
        <div class="descriptionText">
            <p class="productDetail">${el.amount}u - ${el.name}</p>
            <p class="productPrice">$${el.total}</p>
        </div>
        `;
    }
    if(discountCodeChecker){
        container.innerHTML+=`
        <div class="descriptionText">
            <p class="productDetail">DESCUENTO (20OFF)</p>
            <p class="productPrice">-$${total * 0.2}</p>
        </div>
        `;
        mainContainer.innerHTML+=`
        <div class="totalContainer">
            <p class="totalText">TOTAL</p>
            <p class="totalPrice">$${total * 0.8}</p>
        </div>
    `;
    } else{
        mainContainer.innerHTML+=`
        <div class="totalContainer">
            <p class="totalText">TOTAL</p>
            <p class="totalPrice">$${total}</p>
        </div>
        `;
    }
}
// esta función elimina el detalle de compra
const clearProductDetails = ()=>{
    let container = document.querySelectorAll('.descriptionText');
    for(let el of container){
        el.remove();
    }
}

const goToConfirmedPurchaseScreen = ()=>{
    localStorage.clear();
    productCart = [];
    window.location.href = "confirmedPurchaseScreen.html";
}

const goToCanceledPurchaseScreen = ()=>{
    Swal.fire({
        title: 'Está seguro?',
        text: `Va a cancelar su compra`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Cancelar',
        cancelButtonText: 'Regresar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            productCart = [];
            window.location.href = "canceledPurchaseScreen.html";
        }
    })
}
// esta variable almacena el input donde el usuario ingresará su código de descuento
const applyDiscountBtn = document.querySelector('.applyDiscountBtn');

applyDiscountBtn.addEventListener('click', ()=>{
    const discountCodeChecker = checkDiscountCode();
    if(discountCodeChecker){
        Toastify({
            text: "Código de descuento aplicado!",
            duration: 1500
        }).showToast();
    }else{
        Toastify({
            text: "Código inválido",
            duration: 1500
        }).showToast();
    }
    clearProductDetails();
    renderProductDetails(discountCodeChecker);
});

// finalizar compra
const confirmPurchaseBtn = document.querySelector('.confirmPurchase');
confirmPurchaseBtn.addEventListener('click', goToConfirmedPurchaseScreen);

// cancelar compra
const cancelPurchaseBtn = document.querySelector('.cancelPurchase');
cancelPurchaseBtn.addEventListener('click', goToCanceledPurchaseScreen);

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('productCart')) {
        renderProductDetails();
    }
})
