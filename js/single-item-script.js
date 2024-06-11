let shown_item

/**
 * Standard initialization.
 * Also fetches the id of the selected item from the url params and loads it to be shown
 */
function init_item() {
    load_data()
    let search_params = new URLSearchParams(window.location.search)
    let item_id = Number(search_params.get('id'))
    shown_item = get_item_by_id(item_id)
    render({"shown_item": shown_item, "cart_items": cart_items})
}


/**
 * Same functionality as in index-script.js
 * If the item with the given id is not present in the cart, one will be added to the cart.
 * Otherwise, nothing happens
 * @param item_id
 */
function add_to_cart(item_id) {
    console.log(item_id)
    if (!cart_items[item_id.toString()]) {
        cart_items[item_id.toString()] = {
            'amount': 1,
            'item': get_item_by_id(item_id)
        }
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart_items))
    render({"shown_item": shown_item, "cart_items": cart_items})
}