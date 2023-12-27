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



