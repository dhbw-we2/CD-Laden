MAX_AMOUNT = 50

/**
 * Initialize the cart page.
 * Load the data, calculate the grand total and render the Handlebars
 * and add an event listener to the delete modal 'show.bs.modal' event
 */
function init_cart() {
    load_data()
    let grand_total = 0
    for (let key in cart_items) {
        let item = cart_items[key]
        grand_total += item['amount'] * item['item']['price']
    }
    render({
        "cart_items": cart_items,
        "grand_total" : grand_total
    })
    $$('#delete-modal')[0].addEventListener('show.bs.modal', (event) => set_up_delete_modal(event))
}

/**
 * Function is called, when the value in an amount input field is changed.
 * It will be checked if the new amount is valid.
 * If it is, the new amount will be applied, otherwise, nothing happens
 * @param item_id - id of the item to edit the amount of
 */
function submit_amount(item_id) {
    let new_amount = Number(document.getElementById("amount-input-" + item_id).value)
    if (new_amount < 1) {
        cart_items[item_id.toString()]['amount'] = 1
    }
    else if (new_amount > MAX_AMOUNT) {
        cart_items[item_id.toString()]['amount'] = MAX_AMOUNT
    }
    else {
        cart_items[item_id.toString()]['amount'] = new_amount
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart_items))
    init_cart()
}

/**
 * Lower the amount of the given item by one.
 * If the user is about to remove the last item of the given id, the delete dialog for the given item will be triggered
 * @param item_id - id of the targeted item
 */
function remove_one(item_id) {
    if (cart_items[item_id.toString()]['amount'] > 1) {
        cart_items[item_id.toString()]['amount'] -= 1
        localStorage.setItem(CART_KEY, JSON.stringify(cart_items))
        init_cart()
    } else {
        document.getElementById('delete-button-' + item_id).click()
    }
}

/**
 * Similar to remove_one, just the other direction
 * @param item_id - target item id
 */
function add_one(item_id) {
    if(cart_items[item_id.toString()]['amount'] < MAX_AMOUNT)
    cart_items[item_id.toString()]['amount'] += 1
    localStorage.setItem(CART_KEY, JSON.stringify(cart_items))
    init_cart()
}

/**
 * Fill the delete modal with the correct data.
 * The item-id is loaded from the attribute 'data-bs-modaldata' and the text and event listener are set
 * corresponding to the item
 * @param event - event that called the function
 */
function set_up_delete_modal(event){
    let target_item = get_item_by_id(Number(event.relatedTarget.getAttribute('data-bs-modaldata')))
    let current_modal = $$('#delete-modal')[0]
    let delete_button = current_modal.querySelector('#delete-button')
    let item_name = current_modal.querySelector('#delete_item_name')
    item_name.textContent = target_item.name
    delete_button.onclick = () => delete_item(target_item.id)
}

/**
 * Delete the item with the given id from the cart
 * @param item_id - target item id
 */
function delete_item(item_id){
    delete cart_items[item_id.toString()]
    localStorage.setItem(CART_KEY, JSON.stringify(cart_items))
    init_cart()
}