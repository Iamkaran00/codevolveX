import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const initialState = {
 totalItems : localStorage.getItem("totalItems")?JSON.parse(localStorage.getItem('totalItems')):0 ,
 cart : localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [] , 

 total : localStorage.getItem('total' ) ? JSON.parse(localStorage.getItem('total')) : 0,

}; 
const cartSlice = createSlice({
    name : "cart",
    initialState : initialState,
    reducers : {
        setTotalItems(state,value){
            state.totalItems = value.payload;
        },
        //add to cart...

        addToCart : (state,action) => {
            const course = action.payload ;
            const idx = state.cart.findIndex(item=>item._id===course._id) ;
            if(idx>=0)  {
                // course already in cart , don't modify the quantity 
                toast.error('Course already in cart') 
                return
            }
            //if the course is not in the cart , add it 
            state.cart.push(course) 
            //update the total quantity and price 
            state.totalItems++;
            state.total += course.price 
        
            //updating localstorage 

            localStorage.setItem('cart' , JSON.stringify(state.cart)) ;
            localStorage.setItem('total' , JSON.stringify(state.total)) ;
            localStorage.setItem('totalItems', JSON.stringify(state.totalItems));
            //showing toast 
            toast.success('Course added in Cart')
        },
        //remove from cart...

        removeFromCart : (state,action) => {
            const courseId = action.payload 
            const idx = state.cart.findIndex(item=>item._id === courseId) 
            if(idx >=0) {
            state.totalItems --;
            state.total -= state.cart[idx].price ;
            state.cart.splice(idx,1) ;
            localStorage.setItem('total',JSON.stringify(state.total));
            localStorage.setItem('cart',JSON.stringify(state.cart)) ;
            localStorage.setItem('totalItems' , JSON.stringify(state.totalItems)) ;
            
            toast.success('Course removed from cart') ;
            }
        },
        //reset cart...
        resetCart : (state) => {
            state.cart = [] ;
            state.total = 0;
            state.totalItems = 0;
            localStorage.removeItem('cart');
            localStorage.removeItem('total') ;
            localStorage.removeItem('totalItems');
        }

    },
});
export const {setTotalItems,addToCart,removeFromCart,resetCart} = cartSlice.actions;
export default cartSlice.reducer;