
const categoriesCall = async()=>{
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories')
        const categories = await response.json()
        return categories
    } catch (error) {
        console.error(error)
    }
}

const dropdownButton = document.getElementById('dropdownButton')

dropdownButton.onclick = async()=>{

    const categories = await categoriesCall()
    const dropdownButtonArrow = document.getElementById('dropdownButtonArrow')
    dropdownButtonArrow.classList.toggle('dropdown_button_arrow_show')
    const dropdown = document.getElementById('dropdown')
    dropdown.innerHTML=''
    categories.forEach(category => {
        dropdown.innerHTML += `<button>${category}</button>`
    });
    dropdown.classList.toggle('dropdown_show')
}   





