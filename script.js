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
          <button>Add to cart</button>
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
          <button>Add to cart</button>
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

let cartProducts = localStorage.getItem('cardProducts') || []

const createCartProducts = ()=>{
    const cartProducts = document.getElementById('cartProducts')
    cartProducts.innerHTML = ''
    cartProducts.forEach(prod => {
        cartProducts.innerHTML += `
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
                    <button>Remove</button>
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
        `
    });
}
createCartProducts()



