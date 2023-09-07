let productCart = JSON.parse(localStorage.getItem('productCart')) || [];


// esta función devuelve el producto en el cual se hizo click
const getProduct = ()=>{
    let product = document.querySelector('#productName').textContent;
    let currentProduct = productStock.find((item)=>{
        return item.name === product;
    })
    return currentProduct;
}
// esta función devuelve el valor que el usuario ingresó en el input amount
const getAmount = ()=>document.querySelector('#amount').value;

class Product {
    constructor(name, price, amount) {
        this.name = name,
        this.price = price,
        this.amount = amount,
        this.total = this.price * this.amount;
    }
}

// Esta función chequea si el producto que el usuario está tratando de agregar al carrito
// ya existe
const checkExistentProduct = (product)=>productCart.some((item) => item.name === product);

// esta función se ejecuta cada vez que el usuario agregue un producto que ya tenga en su carrito
// y agrega la cantidad seleccionada al objeto del producto que ya se encuentra en el carrito
// en lugar de crear un objeto nuevo
const addToExistentProduct = (product, amount) =>{
    let output = productCart.find((item)=>{
        return item.name === product;
    });
    let outputIndex = productCart.indexOf(output);
    productCart[outputIndex].amount += amount;
    updateTotal(productCart[outputIndex]);
    saveProductCartStorage(productCart);
}

// esta función actualiza la propiedad .total del objeto
const updateTotal = (obj)=>{
    obj.total = obj.price * obj.amount;
}

// esta función agrega productos al array productCart
const addToCart = ()=>{
    let amountInput = document.querySelector('#amount').value;
    // este condicional asegura que el usuario no pueda ingresar un valor menor a 1 en
    // el input "amount"
    if(amountInput < 1) return false;
    let amount = +getAmount();
    let product = getProduct();
    let {name, price} = product;
    let currentProduct = new Product(name, price, amount);
    let productCheck = checkExistentProduct(name);
    if(productCheck){
        addToExistentProduct(name, amount);
        return true;
    }
    productCart.push(currentProduct);
    saveProductCartStorage(productCart);
    return true;
}

const removeFromCart = (e)=>{
    let currentTarget = e.target.getAttribute('id');
    productCart.splice(currentTarget, 1);
}

// esta función agrega 1 unidad al producto
const increaseAmount = (e)=>{
    let currentTarget = e.target.getAttribute('id');
    productCart[currentTarget].amount +=1;
    updateTotal(productCart[currentTarget]);
    saveProductCartStorage(productCart);
    clearProductCart();
    renderProductCart();
}

// esta función quita 1 unidad al producto
const reduceAmount = (e)=>{
    let currentTarget = e.target.getAttribute('id');
    productCart[currentTarget].amount -=1;
    updateTotal(productCart[currentTarget]);
    saveProductCartStorage(productCart);
    if(productCart[currentTarget].amount === 0){
        deleteMiniProductCard(e);
    }
    clearProductCart();
    renderProductCart();
}

//esta función cicla a través del array y suma las propiedades .total de todos los objetos
const calculateTotal = ()=>{
    let total = 0;
    for(let el of productCart){
        total += el.total;
    }
    return total;
}

// esta función toma el valor del input ".discountInput" y se asegura que lo ingresado sea
// un código válido
const checkDiscountCode = ()=>{
    const discountInput = document.querySelector('.discountInput').value;
    return discountInput !== '20OFF' ? false : true;
}

const saveProductCartStorage = (productCart)=>{
    localStorage.setItem('productCart', JSON.stringify(productCart));
}