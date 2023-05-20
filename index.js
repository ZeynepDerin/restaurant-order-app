import {menuArray} from "/data.js"


const orderList = document.getElementById("order-list")
const yourOrder = document.getElementById("your-order")
const priceAndBtn = document.getElementById("price-and-btn")
const yourOrderTitle = document.getElementById("your-order-title")
const checkOutSection = document.getElementById("check-out-section")
const userName = document.getElementById("user-name")
const paymentModal = document.getElementById("payment-modal")

const chosenItemsArray = []
let addButtonClass = "add-button"

function renderTheMenu(){
    menuArray.forEach(function(array){
        orderList.innerHTML += `<div class="menu-items">
                                    <div class="emoji"> ${array.emoji}</div>
                                    <div class="menu-info">
                                        <h2> ${array.name} </h2>
                                        <p> ${array.ingredients.join(", ")} </p>
                                        <h4> $${array.price}</h4>
                                    </div>
                                    <button data-order="${array.uuid}" class="${addButtonClass}"> + </button>
                                    </div>
                                   `
        })
}
renderTheMenu()


document.addEventListener("click", function(e){
    if(e.target.dataset.order) {
        addToOrderList(e.target.dataset.order)
    }
    else if(e.target.dataset.remove) {
        removeItemFunc(e.target.dataset.remove)
    } 
    else if (e.target.id === "orderBtn"){
        paymentModal.style.display = "flex"
    }
    else if (e.target.id === "reorder-btn"){
        window.location.reload()
    }
})

function addToOrderList(idOfClickedElement){
    const chosenItem = menuArray.filter(function(item){
        return item.uuid === idOfClickedElement
    })[0]
    chosenItemsArray.push(chosenItem)
    renderTheOrders()
}

function removeItemFunc(itemToRemoveId) {
    const index = chosenItemsArray.findIndex(function (obj){
        return obj.uuid === itemToRemoveId
    })
    chosenItemsArray.splice(index, 1)
    renderTheOrders()
    if (chosenItemsArray.length === 0) {
        priceAndBtn.innerHTML = `
          <h4> Your order box is empty!</h4>
          <div class="total-price-container" >
            <h2> Total Price: </h2>
            <h4>$ 0</h4>
          </div>
          <button class="complete-order-btn" style="cursor:not-allowed" disabled> Complete order </button>
        `;
      }
}


paymentModal.addEventListener("submit", function(e){
    e.preventDefault()

    paymentModal.style.display = "none"

    checkOutSection.innerHTML = `
    <p class="check-out-message"> Thanks, ${userName.value}! Your order is on its way!</p>
    <button id="reorder-btn" class="reorder-btn"> Did you forget something? Click here to reorder! </button>`
    
    addButtonClass = "add-button-after-order"
    orderList.innerHTML = ``
    renderTheMenu()

})


function renderTheOrders() {
  yourOrderTitle.textContent = "Your order"
  yourOrder.innerHTML = ''
  let totalPrice = 0

  const groupedItems = chosenItemsArray.reduce((acc, item) => {
    const existingItem = acc.find(groupedItem => groupedItem.uuid === item.uuid)
    if (existingItem) {
      existingItem.count++
    } else {
      acc.push(Object.assign({}, item, {count:1}))
    }
    return acc
  }, [])

  totalPrice = groupedItems.reduce((total, item) => total + (item.price * item.count), 0)

  groupedItems.forEach(function (chosenItem) {
    yourOrder.innerHTML += `
      <div class= "ordered-items" > 
        <h2> ${chosenItem.name} x ${chosenItem.count}  <span data-remove="${chosenItem.uuid}" 
        style="cursor:pointer" > remove </span> </h2>
        <h4> $${chosenItem.price}</h4>
      </div>
    `
  })

  priceAndBtn.innerHTML = `
    <div class="total-price-container" >
      <h2> Total Price: </h2>
      <h4>$ ${totalPrice} </h4>
    </div>
    <button class="complete-order-btn" id= "orderBtn"}"> Complete order </button>
  `
}
  
