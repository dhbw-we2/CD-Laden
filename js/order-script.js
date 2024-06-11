/**
 * Self-explanatory initialization
 */
function init_order() {
   load_data()
   render({"cart_items": cart_items, "orders": orders})
}