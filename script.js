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
            categoryList.innerHTML += `<button>${category}</button>`
        });
 }


if (document.body.clientWidth <= 480 ) {
    createCategoryList()
}

// filtro en categorias

const categoriesDropdownButton = document.getElementById('categoriesDropdownButton')

categoriesDropdownButton.onclick = async()=>{
    
    const dropdown = document.getElementById('categoriesDropdown')
    if (!dropdown.classList[1]) {
        const categories = await categoriesCall()
        dropdown.innerHTML=''
        categories.forEach(category => {
            dropdown.innerHTML += `<button>${category}</button>`
        });
    }

    const dropdownButtonArrow = document.getElementById('categoriesDropdownButtonArrow')
    dropdownButtonArrow.classList.toggle('categories_dropdown_button_arrow_show')
    dropdown.classList.toggle('categories_dropdown_show')
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


const createRowProducts = async ()=>{
    const productList = document.getElementById('productList')
    productList.innerHTML =''
    const products = await productsCall()
    products.forEach(prod => {
        productList.innerHTML += `<div class="product_row" >
        <div class="product_row_img"><img src="${prod.image}" alt="" /></div>
        <div class="product_row_content">
          <h2>${prod.title}</h2>
          <p class="product_row_price">$${prod.price}</p>
          <p class="product_row_description">
            ${prod.description}
          </p>
          <a href="">View details</a>
        </div>
      </div>`
    });
    productCount.innerHTML = `${products.length} items in <b>Mobile accessory</b>`
}
createRowProducts()

const createCardProducts = async ()=>{
    const productList = document.getElementById('productList')
    productList.innerHTML =''
    const products = await productsCall()
    products.forEach(prod => {
        productList.innerHTML += `<div class="product_card">
        <div class="product_card_img"><img src="${prod.image}" alt="" /></div>
        <div class="product_card_content">
          <p class="product_card_price">$${prod.price}</p>
          <h2>${prod.title}</h2>
          <a href="">View details</a>
        </div>
      </div>`
    });
    productCount.innerHTML = `${products.length} items in <b>Mobile accessory</b>`

}

const productsStyleButtonCard = document.getElementById('productsStyleButtonCard')

const productsStyleButtonList = document.getElementById('productsStyleButtonList')



productsStyleButtonCard.onclick = async ()=>{
    await createCardProducts()
    productsStyleButtonCard.classList.toggle('products_style_button_card_active')
    productsStyleButtonList.classList.toggle('products_style_button_list_active')
}

productsStyleButtonList.onclick =async ()=>{
    await createRowProducts()
    productsStyleButtonCard.classList.toggle('products_style_button_card_active')
    productsStyleButtonList.classList.toggle('products_style_button_list_active')
}



