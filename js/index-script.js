let shown_data

/**
 * Initialization of the index page.
 * Load all items, render the Handlebars, bind event listeners and call apply_filters for the sorting of the items
 * @returns {Promise<void>}
 */
async function init() {
    load_data()
    shown_data = all_items
    await update()
    $on($$('#filter-offcanvas'), 'hide.bs.offcanvas', apply_filters)
    $on($$('#search-input'), 'change', apply_filters)
    $on($$('#search-button'), 'click', apply_filters)
    apply_filters()
}

/**
 * Called, when add to cart is clicked.
 * If the item with the given id has an entry in the cart, nothing happens.
 * Otherwise, it will be added to the cart with an amount of 1.
 * @param item_id - the id of the item to be added to the cart
 */
function add_to_cart(item_id) {
    if (!cart_items[item_id.toString()]) {
        cart_items[item_id.toString()] = {'amount': 1,
                                          'item': get_item_by_id(item_id)}
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart_items))
    update('#item-list')
    update('#cart-offcanvas-template')
    update('#navbar-template')
}

/**
 * apply_filters applies the filters set by the user.
 * The set filters like genres, price, search query and sorting are read from the forms and
 * applied to the data, then handed to the handlebars
 */
function apply_filters() {
    shown_data = all_items
    const shown_genres = Array.from(document.getElementById('genre-checkbox-list')
        .querySelectorAll(':checked'))
        .map((element) => element.value)
    if (shown_genres.length > 0) {
        shown_data = all_items.filter(all_items => new Set(all_items.genres).intersection(new Set(shown_genres)).size > 0)
    }
    let search_query = document.getElementById('search-input').value.toLowerCase()
    let min_price = Number(document.getElementById('min-filter-input').value) * 100
    let max_price = Number(document.getElementById('max-filter-input').value) * 100
    max_price = max_price === 0 ? 100000 : max_price
    if (search_query !== '') {
        shown_data = shown_data.filter((item) => {
            return (item.name.toLowerCase().includes(search_query)) ||
                item.artist.toLowerCase().includes(search_query) ||
                item.tracks.filter((track) => track.name.toLowerCase().includes(search_query)).length > 0 ||
                item.genres.filter((genre) => genre.toLowerCase().includes(search_query)).length > 0
        })
    }
    shown_data = shown_data.filter((item) => {
        return item.price >= min_price && item.price <= max_price
    })
    shown_data = handleSorting(shown_data)
    update('#item-list')
}

/**
 * Reads the wanted sorting from the form and applies it to the given array of items and returns it in sorted state
 * @param shown_data - array to sort
 * @returns {*} - sorted array
 */
function handleSorting(shown_data) {
    switch (document.getElementById("sorting-select").value) {
        case 'A-to-Z':
            shown_data.sort(function (a, b) {
                return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0
            })
            break
        case 'Z-to-A':
            shown_data.sort(function (a, b) {
                return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 0
            })
            break
        case 'p-low-to-high':
            shown_data.sort(function (a, b) {
                return a.price - b.price
            })
            break
        case 'p-high-to-low':
            shown_data.sort(function (a, b) {
                return b.price - a.price
            })
            break
        case 'Artist-A-Z':
            shown_data.sort(function (a, b) {
                return a.artist.toLowerCase() < b.artist.toLowerCase() ? -1 : a.artist.toLowerCase() > b.artist.toLowerCase() ? 1 : 0
            })
            break
        case 'Artist-Z-A':
            shown_data.sort(function (a, b) {
                return a.artist.toLowerCase() < b.artist.toLowerCase() ? 1 : a.artist.toLowerCase() > b.artist.toLowerCase() ? -1 : 0
            })
    } 
    return shown_data
}

/**
 * Wrapper to the call of the render function, takes a query_selector for a partial reload of the handlebars
 * @param query_selector - query selector for the templates to refresh, optional
 * @returns {Promise<void>}
 */
async function update(query_selector) {
    await render({"all_items": shown_data, "categorys": null, "show_search": true, "genres": genres, "cart_items": cart_items}, query_selector)
}
