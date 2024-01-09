// Funcion para trer categorias de forma asincrona

const categoriesCall = async()=>{
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories')
        const categories = await response.json()
        return categories
    } catch (error) {
        console.error(error)
    }
}

// Crea categorias en desktop

const dropdownButton = document.getElementById('dropdownButton')

dropdownButton.onclick = async()=>{
    
    const dropdown = document.getElementById('dropdown')
    if (!dropdown.classList[1]) {
        const categories = await categoriesCall()
        dropdown.innerHTML=''
        categories.forEach(category => {
            dropdown.innerHTML += `<button>${category}</button>`
        });
    }

    const dropdownButtonArrow = document.getElementById('dropdownButtonArrow')
    dropdownButtonArrow.classList.toggle('dropdown_button_arrow_show')
    dropdown.classList.toggle('dropdown_show')
}

// Crea categorias en mobile

 const createCategoryList = async ()=>{
    const categoryList = document.getElementById('categoryList')
    const categories = await categoriesCall()
        categoryList.innerHTML=''
        categories.forEach(category => {
            categoryList.innerHTML += `<button onclick='filterByCategory("${category.replace(/'/g, '`')}")'>${category}</button>`
        });
 }

if (document.body.clientWidth <= 480 ) {
    createCategoryList()
}

//Pintan las cards de los productos trayendo desde la api

let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || []

const addProductToCart = async (pid)=>{
    if (!cartProducts.some((prod)=>prod.id == pid )) {
        const response = await fetch(`https://fakestoreapi.com/products/${pid}`)
        const data = await response.json()
        cartProducts.push(data)   
    }
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts))
    createCart()
}

const productsCall = async (category = null)=>{
    try {
        const response = await fetch(`https://fakestoreapi.com/products${category ? `/category/${category}`:''}`)
        const data = await response.json()
        return data
    } catch (error) 
    { 
        console.error(error);
    }
}
const productCount = document.getElementById('productCount')


const createRowProducts = async (category = null)=>{
    const productList = document.getElementById('productList')
    productList.innerHTML =''
    const products = await productsCall(category)
    products.forEach(prod => {
        productList.innerHTML += `<div class="product_row" >
        <div class="product_row_img"><img src="${prod.image}" alt="" /></div>
        <div class="product_row_content">
          <h2>${prod.title}</h2>
          <p class="product_row_price">$${prod.price}</p>
          <p class="product_row_description">
            ${prod.description}
          </p>
          <button onclick="addProductToCart('${prod.id}')">Add to cart</button>
        </div>
      </div>`
    });
    productCount.innerHTML = `${products.length} items in <b>Mobile accessory</b>`
}
createRowProducts()

const createCardProducts = async (category = null)=>{
    const productList = document.getElementById('productList')
    productList.innerHTML =''
    const products = await productsCall(category)
    products.forEach(prod => {
        productList.innerHTML += `<div class="product_card">
        <div class="product_card_img"><img src="${prod.image}" alt="" /></div>
        <div class="product_card_content">
          <p class="product_card_price">$${prod.price}</p>
          <h2>${prod.title}</h2>
          <button onclick="addProductToCart(${prod})" >Add to cart</button>
        </div>
      </div>`
    });
    productCount.innerHTML = `${products.length} items in <b>Mobile accessory</b>`
}

// filtro en categorias

let productsStyle = 'list'

const  filterByCategory = async (category)=>{
    if (productsStyle == 'list') {
        createRowProducts(category.replace(/`/g, "'"))   
    }else{
        createCardProducts(category.replace(/`/g, "'"))
    }
}

const categoriesDropdownButton = document.getElementById('categoriesDropdownButton')

categoriesDropdownButton.onclick = async()=>{
    const dropdown = document.getElementById('categoriesDropdown')
    if (!dropdown.classList[1]) {
        const categories = await categoriesCall()
        dropdown.innerHTML=''
        categories.forEach(category => {
            console.log(category.split(' ').join('%20'));

            dropdown.innerHTML += `<button onclick='filterByCategory("${category.replace(/'/g, '`')}")'>${category}</button>`
        });
    }
    const dropdownButtonArrow = document.getElementById('categoriesDropdownButtonArrow')
    dropdownButtonArrow.classList.toggle('categories_dropdown_button_arrow_show')
    dropdown.classList.toggle('categories_dropdown_show')
}

const productsStyleButtonCard = document.getElementById('productsStyleButtonCard')

const productsStyleButtonList = document.getElementById('productsStyleButtonList')

productsStyleButtonCard.onclick = async ()=>{
    await createCardProducts()
    productsStyle = 'card'
    productsStyleButtonCard.classList.toggle('products_style_button_card_active')
    productsStyleButtonList.classList.toggle('products_style_button_list_active')
}

productsStyleButtonList.onclick =async ()=>{
    await createRowProducts()
    productsStyle = 'list'
    productsStyleButtonCard.classList.toggle('products_style_button_card_active')
    productsStyleButtonList.classList.toggle('products_style_button_list_active')
}

//




const deleteProductFromCart = (pid)=>{
    cartProducts = cartProducts.filter((prod)=>prod.id != pid)
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts))
    createCart()
}
const deleteAllProductFromCart = ()=>{
    cartProducts = []
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts))
    createCart()
}

const removeAllCart = document.getElementById('removeAllCart')

removeAllCart.onclick = deleteAllProductFromCart

const cartProductsContainer = document.getElementById('cartProducts')

const cartSubtotal = document.getElementById('cartSubtotal')

const cartTotal = document.getElementById('cartTotal')

const createCartProducts = ()=>{
    cartProductsContainer.innerHTML = ''
    cartProducts.forEach(prod => {
        cartProductsContainer.innerHTML += `
        <div class="cart_product_card">
                <div class="cart_product_info">
                  <div class="cart_product_img">
                    <img
                      src="${prod.image}"
                      alt=""
                    />
                  </div>
                  <div class="cart_product_title">
                    <h3>${prod.title}</h3>
                    <button onclick='deleteProductFromCart(${prod.id})' >Remove</button>
                  </div>
                </div>
                <div class="cart_product_pricing">
                    <p>$${prod.price}</p>
                    <div class="cart_product_counter">
                        <button>-</button>
                        <span>3</span>
                        <button>+</button>
                    </div>
                </div>

              </div>
            <span class="cart_separator"></span> 
        `
     
    });
    cartSubtotal.innerHTML = cartProducts.reduce((acc,prod)=>acc + prod.price,0)
    cartTotal.innerHTML = cartProducts.reduce((acc,prod)=>acc + prod.price,0)
}

const createEmptyCart= ()=>{
    cartProductsContainer.innerHTML = `<div class="cart_empty">
    <img src="./assets/img/bolsas-de-compra.png" alt="Blsa de compras">
    <p>¡Empieza un carrito de compras!</p>
  </div> 
  <span class="cart_separator"></span>`
  cartSubtotal.innerHTML = 0
  cartTotal.innerHTML = 0
}

const createCart = ()=>{
    if (cartProducts.length == 0) {
        return createEmptyCart()
    }
    createCartProducts()
}
createCart()

const finishSale = document.getElementById('finishSale')


finishSale.onclick = ()=>{
    if (cartProducts.length == 0) {
        return Swal.fire({
            title: "Error en su compra",
            text: "No puede finalizar su compra, si no agrega productos al carrito",
            icon: "error"
          });
    }
    Swal.fire({
        title: "Compra realizada con exito",
        text: `finalizo su compra con un total de: $${cartProducts.reduce((acc,prod)=>acc + prod.price,0)}`,
        icon: "success"
      });
    deleteAllProductFromCart()
}








