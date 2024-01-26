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
    // A partir de aca se insertan los botones de las categorias
    const dropdown = document.getElementById('dropdown')
    if (!dropdown.classList[1]) {
        const categories = await categoriesCall() //se utiliza la funcion categoriesCall con async/await
        dropdown.innerHTML=''
        categories.forEach(category => {
            dropdown.innerHTML += `<button>${category}</button>`
        });
    }
    
    // aca se da vuelta la flecha del Dropdown 

    const dropdownButtonArrow = document.getElementById('dropdownButtonArrow')
    dropdownButtonArrow.classList.toggle('dropdown_button_arrow_show')
    dropdown.classList.toggle('dropdown_show')
}

// Crea categorias en mobile (esto se hace para que tengan un estilo diferente al Desktop)

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

// Se traen los productos del local Storage en caso de que existan 
let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || []

// con esta funcion agregamos productos al carrito 
const addProductToCart = async (pid)=>{
    const productButton = document.getElementById(`productButton${pid}`)
    productButton.disabled = true // Se deshabilita el boton que ejecuta la funcion para evitar errores de asincronia
    
    //se verifica si existe el elemento para sumar su cantidad 
    //en caso de existir o sumar todos sus datos en caso de que no sea asi 
    if (!cartProducts.some((elem)=>elem.product.id == pid )) {
        const response = await fetch(`https://fakestoreapi.com/products/${pid}`) // se trae el producto con el id especificado
        const data = await response.json()
        cartProducts.push({
            quantity:1,
            product : data
        })   
    }else{
        //se busca el elemento y se suma uno a su cantidad 
        cartProducts.map((elem)=>{

            if (elem.product.id == pid) {
                elem.quantity += 1
            }
            return elem
        })
    }
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts)) // se guarda el carrito actualizado en el local Storage
    createCart()
    productButton.disabled = false
}

// funcion para traer todos los productos y filtrarlos por categorias de ser encesario
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

const productCount = document.getElementById('productCount') // elemento que muestra la cantidad de productos de la pagina

// Se crean los productos en su version de lista
const createRowProducts = async (category = null)=>{    
    const productList = document.getElementById('productList')
    productList.innerHTML ='' 
    const products = await productsCall(category) // Se utiliza lafuncion productCall para obtener los productos
    products.forEach(prod => {
        productList.innerHTML += `<div class="product_row" >
        <div class="product_row_img"><img src="${prod.image}" alt="" /></div>
        <div class="product_row_content">
          <h2>${prod.title}</h2>
          <p class="product_row_price">$${prod.price}</p>
          <p class="product_row_description">
            ${prod.description}
          </p>
          <button id="productButton${prod.id}" onclick="addProductToCart('${prod.id}')">Add to cart</button>
        </div>
      </div>`
    });
    productCount.innerHTML = `${products.length} items in <b>Mobile accessory</b>` // aca se cambia la cantidad de elementos
}
createRowProducts()

// esta funcion crea los productos en su version de cards
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
          <button id="productButton${prod.id}" onclick="addProductToCart(${prod})" >Add to cart</button>
        </div>
      </div>`
    });
    productCount.innerHTML = `${products.length} items in <b>Mobile accessory</b>`
}

// filtro en categorias

let productsStyle = 'list'

// con esta funcion se filtra los productos por categorias 
const  filterByCategory = async (category)=>{
    if (productsStyle == 'list') {
        createRowProducts(category.replace(/`/g, "'"))   
    }else{
        createCardProducts(category.replace(/`/g, "'"))
    }
}

// este es el elemento  dropdown para mostrar las categorias 
const categoriesDropdownButton = document.getElementById('categoriesDropdownButton')

// se agrega un onlick para que se muestren o no las categorias del dropdown 
categoriesDropdownButton.onclick = async()=>{
    const dropdown = document.getElementById('categoriesDropdown')
    if (!dropdown.classList[1]) {
        const categories = await categoriesCall()
        dropdown.innerHTML=''
        categories.forEach(category => {
            dropdown.innerHTML += `<button onclick='filterByCategory("${category.replace(/'/g, '`')}")'>${category}</button>`
        });
    }
    const dropdownButtonArrow = document.getElementById('categoriesDropdownButtonArrow')
    dropdownButtonArrow.classList.toggle('categories_dropdown_button_arrow_show')
    dropdown.classList.toggle('categories_dropdown_show')
}

// botones que cambian los estilos de los productos (lista o cards)

const productsStyleButtonCard = document.getElementById('productsStyleButtonCard')

const productsStyleButtonList = document.getElementById('productsStyleButtonList')

// funciones que cambian los estilos de los productos (lista o cards)
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

// Se elimina un producto del carrito
const deleteProductFromCart = (pid)=>{
    cartProducts = cartProducts.filter((elem)=>elem.product.id != pid)
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts))
    createCart()
}

// se asigna un onclick a cada boton de eliminar del carrito con la funcionalidad de deleteProductFromCart
const onclicksForCartDeleteButtons = ()=>{
    const deleteProductFromCartButtons = document.querySelectorAll('.delete_product_from_cart_button')

    deleteProductFromCartButtons.forEach((button)=>{
        button.onclick = ()=>deleteProductFromCart(button.id)
    })
}

// con esta funcion se eliminan todos los productos del carito 
const deleteAllProductFromCart = ()=>{
    cartProducts = []
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts))
    createCart()
}

// Boton para eliminar todo del carrito 
const removeAllCart = document.getElementById('removeAllCart')

removeAllCart.onclick = deleteAllProductFromCart

// Contenedor de los productos 
const cartProductsContainer = document.getElementById('cartProducts')

// elemento que muestra el subtotal de la compra 
const cartSubtotal = document.getElementById('cartSubtotal')

// elemento que muestra el total de la compra 
const cartTotal = document.getElementById('cartTotal')

// Con esta funcion se suma uno en la cantidad del producto especificado con el pid
const addQuantity = (pid)=>{
    cartProducts = cartProducts.map((elem)=>{
        if (elem.product.id == pid) {
            elem.quantity += 1
        }
        return elem
    })
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts))
    createCart()
}
// Con esta funcion se resta uno en la cantidad del producto especificado con el pid
const removeQuantity = (pid)=>{
    cartProducts = cartProducts.map((elem)=>{
        if (elem.product.id == pid) {
            if (elem.quantity > 1 ) {
                elem.quantity -= 1
            }
        }
        return elem
    })
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts))
    createCart()
}

// aca se agrega al html todos los productos que esten dentro del array del carrito
const createCartProducts = ()=>{
    cartProductsContainer.innerHTML = ''
    cartProducts.forEach(elem => {
        cartProductsContainer.innerHTML += `
        <div class="cart_product_card">
                <div class="cart_product_info">
                  <div class="cart_product_img">
                    <img
                      src="${elem.product.image}"
                      alt=""
                    />
                  </div>
                  <div class="cart_product_title">
                    <h3>${elem.product.title}</h3>
                    <button class="delete_product_from_cart_button" id="${elem.product.id}">Remove</button>
                  </div>
                </div>
                <div class="cart_product_pricing">
                    <p>$${elem.product.price}</p>
                    <div class="cart_product_counter">
                        <button onclick="removeQuantity(${elem.product.id})">-</button>
                        <span>${elem.quantity}</span>
                        <button onclick="addQuantity(${elem.product.id})">+</button>
                    </div>
                </div>
              </div>
            <span class="cart_separator"></span> 
        `
    });
    onclicksForCartDeleteButtons() // despues de creados los productos se agregan los onclicks a los botones de remover 
    cartSubtotal.innerHTML = cartProducts.reduce((acc,elem)=>acc + elem.quantity * elem.product.price,0).toFixed(2)
    cartTotal.innerHTML = cartProducts.reduce((acc,elem)=>acc + elem.quantity * elem.product.price,0).toFixed(2)
}

// se crean los estilos del carrito vacio 
const createEmptyCart= ()=>{
    cartProductsContainer.innerHTML = `<div class="cart_empty">
    <img src="./assets/img/bolsas-de-compra.png" alt="Blsa de compras">
    <p>¡Empieza un carrito de compras!</p>
  </div> 
  <span class="cart_separator"></span>`
  cartSubtotal.innerHTML = 0
  cartTotal.innerHTML = 0
}

// se decide si crean los productos o el carrito vacio dependiendo de la cantidad de productos en el array de carrito
const createCart = ()=>{
    if (cartProducts.length == 0) {
        return createEmptyCart()
    }
    createCartProducts()
}
createCart()

// Boton de finalizar la compra
const finishSale = document.getElementById('finishSale')

// funcionalidad de finalizacion de la compra 
finishSale.onclick = async ()=>{
    // se muestra un error en caso de que no haya productos en el carrito
    if (cartProducts.length == 0) {
        return Swal.fire({
            title: "Error en su compra",
            text: "No puede finalizar su compra, si no agrega productos al carrito",
            icon: "error"
          });
    }
    // se crea con sweet alert un formulario para ingresar datos del usuario 
    const { value: formValues } = await Swal.fire({
        title: "Rellena el formulario para terminar la compra",
        html: `
            <input id="swal-input1" placeholder="Nombre" class="swal2-input">
            <input id="swal-input2" placeholder="Email" class="swal2-input" type="email" >
            <input id="swal-input3" placeholder="Celular" class="swal2-input" type="number">
        `,
        focusConfirm: false,
        preConfirm: () => {
          return {
            name:document.getElementById("swal-input1").value,
            email:document.getElementById("swal-input2").value,
            phone:document.getElementById("swal-input3").value
          }
        }
      });
      // se verifica si el formulario esta completo y se termina la compra en caso de ser asi.
      if (formValues.name != "" || formValues.email != "" || formValues.phone != "") {
        Swal.fire({
            icon: "success",
            title: "Excelete",
            html: `<h3>Su compra fue realizada:</h3>
            <p>Total de compra: ${cartProducts.reduce((acc,elem)=>acc + elem.quantity * elem.product.price,0).toFixed(2)} </p>
            <p>Su ticket se a: ${formValues.email}</p>`,
            footer: `<p>En caso de error en la transaccion el enviaremos un mensaje a ${formValues.phone}</p>`
          });

        }else{
        return Swal.fire({
            title: "Error en su compra",
            text: "Debe rellenar todos los campos del formulario",
            icon: "error"
          });
      }
    deleteAllProductFromCart()// se eliminan todos los productos del carrito
}








