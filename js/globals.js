const ITEMS_KEY = "all_items"
const CART_KEY = "cart_items"
const ORDERS_KEY = "orders"
let genres = new Set()
let all_items = []
let cart_items = {}
let orders = []

/**
 * This function loads the data needed by all sites.
 * The cart will be loaded from LocalStorage or initialized as empty.
 * The items available in the shop will be loaded from the LocalStorage and if they ore not available there,
 * fetched from a JSON file. The function is async to await the fetch call and prevent missing data in further steps.
 * A list of genres is created from the loaded items as well.
 * @returns {Promise<void>} - returned due to async function
 */
async function load_data() {
    if (localStorage.getItem(CART_KEY) != null) {
        cart_items = JSON.parse(localStorage.getItem(CART_KEY))
    }
    if (localStorage.getItem(ITEMS_KEY) == null) {
        await fetch("product_data.json")
            .then(res => res.json())
            .then(json => {
                localStorage.setItem(ITEMS_KEY, JSON.stringify(json))
                all_items = json
            })
    } else {
        all_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    }

    all_items.forEach((item) => item.genres.forEach((genre) => genres.add(genre)))
    genres = new Set(Array.from(genres).sort())
    if (localStorage.getItem(ORDERS_KEY) !== null) {
        orders = JSON.parse(localStorage.getItem(ORDERS_KEY))
    }
}

/**
 * Takes in an item_id and returns the corresponding item
 * @param item_id - id of the item to return
 * @returns {*}
 */
function get_item_by_id(item_id) {
    return all_items.filter((all_items) => {
        return all_items.id === item_id
    })[0]
}

/**
 * Handlebars helper to multiply two values
 */
Handlebars.registerHelper('multiply', (x, y) =>{
    return x * y
})

/**
 * Handlebars helper to format the price saved in cents to be displayed in Euros with a comma
 */
Handlebars.registerHelper('format_price', (price) => {
    let price_string = price.toString()
    if (price < 100) {
        if (price < 10) {
            return "0,0" + price_string
        }
        return "0,"+price_string
    }
    return price_string.substring(0, price_string.length - 2) + "," + price_string.substring(price_string.length - 2, price_string.length)
})

/**
 * Handlebars helper that takes an item_id as an argument and returns the amount of items of the
 * item corresponding to the id in the cart
 */
Handlebars.registerHelper('amount_in_cart', (item_id) => {
    return cart_items[item_id.toString()] ? cart_items[item_id.toString()]['amount'] : null
})

/**
 * Handlebars helper to turn the time given in milliseconds in the data into a readable format
 * in Minutes with a : between minutes and seconds
 */
Handlebars.registerHelper('ms_to_min', (ms) => {
    let minutes = Math.floor((ms / 1000) / 60)
    let seconds = Math.floor((ms / 1000) % 60)
    return minutes.toString() + ':' + seconds.toString() + (seconds < 10 ? '0' : '')
})

/**
 * I don't think that I have to explain
 */
Handlebars.registerHelper('plus_one', (x) => {return x + 1})

/**
 * Handlebars helper capitalizing the first letter of each word of the input string
 */
Handlebars.registerHelper('capitalize_firsts', (in_str) => {
    let words = in_str.split(' ')
    let return_val = ''
    for (let key in words) {
        return_val += words[key].charAt(0).toUpperCase() + words[key].slice(1) + ' '
    }
    return return_val.trim()
})

/**
 * Handlebars helper returning the amount of unique items in the cart
 */
Handlebars.registerHelper('cart_size', () => Object.keys(cart_items).length)

/**
 * Handlebars helper returning if there are any items in the cart
 */
Handlebars.registerHelper('empty_cart', () => Object.keys(cart_items).length <= 0)

/**
 * Handlebars helper formatting the date from YYYY-MM-DD to DD.MM.YYYY where the day and month are optional
 */
Handlebars.registerHelper('format_date', (a) => {
    let date = a.split('-')
    let date_string = ''
    if (date[2]) {
        date_string += date[2] + '.'
    }
    if (date[1]) {
        date_string += date[1] + '.'
    }
    date_string += date[0]
    return date_string
})

Handlebars.registerHelper('slice', (array, length) => {
    return Object.fromEntries(Object.entries(array).slice(0, length))
})