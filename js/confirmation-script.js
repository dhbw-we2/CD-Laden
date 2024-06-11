/**
 * Initialization of the page.
 * Load the needed data, fetch teh order to show from the url params and render the handlebars
 */
function init_confirmation() {
    load_data()
    let url_params = new URLSearchParams(window.location.search)
    let order_id = url_params.get('order_id')
    let last_order = orders[order_id]
    render({"order": last_order, "cart_items": cart_items})
}