/**
 * Initialize the checkout page.
 * Load the data, add event listener to submit button and render the Handlebars
 */
function init_checkout() {
    load_data()
    $on($$('#checkout-form'), 'submit', submit_order)
    render({"cart_items": cart_items})
}

/**
 * Function checks if the form is valid.
 * If it is, a new order is placed and the page will be changed to the confirmation page.
 */
function submit_order() {
    const form = $$('#checkout-form')[0]
    event.preventDefault()
    if (form.checkValidity() === false) {
        event.stopPropagation()
        console.log('not validated')
    }
    else {
        console.log('validated')
        place_order(form)
        window.location.href = 'confirmation.html?order_id=' + (orders.length - 1)
    }
    form.classList.add('was-validated')
}

/**
 * This function takes in a form, that should be the one on the cart page with shipping info etc.
 * Data from the form is extracted and packaged in an order Object together with the cart, date and grand total.
 * The order added to an array of orders and saved in the LocalStorage.
 * The cart gets emptied.
 * @param form
 */
function place_order(form) {
    let billing_info
    if (document.getElementById("paypal").checked) {
        billing_info = {
            "first_name": form.firstName.value,
            "last_name": form.lastName.value,
            "email": form.email.value,
            "city": form.city.value,
            "address": form.address.value,
            "country": form.country.value,
            "payment": "paypal"
            }
        }
    else {
        billing_info = {
            "first_name": form.firstName.value,
            "last_name": form.lastName.value,
            "email": form.email.value,
            "city": form.city.value,
            "address": form.address.value,
            "country": form.country.value,
            "payment": {
                "cc_name": form.cc_name.value,
                "cc_number": form.cc_number.value,
                "cc_expiration": form.cc_expiration.value,
                "cc_cvv": form.cc_cvv.value
            }
        }
    }
    const date = new Date().toLocaleString('de-DE')
    let grand_total = 0
    Object.entries(cart_items).forEach(([_, element]) => grand_total += element.amount * element.item.price)
    orders.push({
        "order_nr": orders.length,
        "billing_info": billing_info,
        "date": date,
        "items": cart_items,
        "grand_total": grand_total
    })
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    cart_items = {}
    localStorage.setItem(CART_KEY, JSON.stringify(cart_items))
    console.log(orders)
}

/**
 * Control to show the form for the selected payment method.
 */
function showblock(){
    if (document.getElementById("credit").checked || document.getElementById("debit").checked){
        document.getElementById("card payment").style.display = "block";
    }
    else {
        document.getElementById("card payment").style.display = "none";
    }
}

/**
 * This function makes the form elements for the payment non-required, when paypal is selected
 */
function check_require(){
    if (document.getElementById("paypal").checked) {
        document.getElementById("cc_cvv").required = false;
        document.getElementById("cc_name").required = false;
        document.getElementById("cc_number").required = false;
        document.getElementById("cc_expiration").required = false;
    }
    else{
        document.getElementById("cc_cvv").required = true;
        document.getElementById("cc_name").required = true;
        document.getElementById("cc_number").required = true;
        document.getElementById("cc_expiration").required = true;
    }
}
