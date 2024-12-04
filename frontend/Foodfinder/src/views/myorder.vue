<template>
  <div class="cart-page">
    <div class="back-button-x" @click="goBack">×</div>
    <h1 class="cart-title">Your Cart</h1>
    
    <div class="cart-container">
      <div class="cart-items">
        <div class="cart-header">
          <span class="header-product">PRODUCT</span>
          <span class="header-price">PRICE</span>
          <span class="header-quantity">QUANTITY</span>
          <span class="header-total">TOTAL</span>
          <span class="header-remove"></span>
        </div>

        <div v-if="cartStore.items.length === 0" class="empty-cart">
          Your cart is empty
        </div>

        <div v-else v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-product">
            <img :src="getImageUrl(item.image)" :alt="item.name" class="item-image" />
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="item-store">From: {{ item.storeName }}</p>
            </div>
          </div>
          <div class="item-price">₱{{ item.price }}</div>
          <div class="item-quantity">
          
            <span>{{ item.quantity }}</span>
      
          </div>
          <div class="item-total">₱{{ item.price * item.quantity }}</div>
          <button @click="removeFromCart(item)" class="remove-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>₱{{ cartStore.totalPrice }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>0</span>
        </div>
        <div class="coupon-code">
          <input v-model="couponCode" placeholder="Enter coupon code" class="coupon-input" />
          <button @click="applyCoupon" class="apply-coupon-btn">Apply Coupon</button>
          <p v-if="couponError" class="coupon-error">{{ couponError }}</p>
          <div v-if="cartStore.appliedCoupon" class="applied-coupon">
            <p>Coupon applied: {{ cartStore.appliedCoupon }}</p>
            <button @click="removeCoupon" class="remove-coupon-btn">Remove Coupon</button>
          </div>
        </div>
        <div class="summary-total">
          <span>Total</span>
          <span v-if="cartStore.appliedCoupon" class="discounted-price">
            <s>₱{{ cartStore.totalPrice.toFixed(2) }}</s>
            ₱{{ cartStore.discountedTotalPrice.toFixed(2) }}
          </span>
          <span v-else>₱{{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <div class="payment-options">
          <h3>Payment Method</h3>
          <div class="payment-option">
            <input type="radio" id="gcash" value="gcash" v-model="paymentMethod">
            <label for="gcash">GCash</label>
          </div>
          <div class="payment-option">
            <input type="radio" id="cod" value="cod" v-model="paymentMethod">
            <label for="cod">Cash on Delivery</label>
          </div>
        </div>
        <button @click="checkout" class="checkout-btn" :disabled="!paymentMethod || cartStore.items.length === 0">
          CHECKOUT
        </button>
      </div>
    </div>

    <div v-if="showCheckoutPrompt" class="checkout-prompt">
      <div class="prompt-content">
        <h2>Order Confirmation</h2>
        <p>Your order has been successfully placed!</p>
        <button @click="closeCheckoutPrompt" class="close-prompt-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/cart/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()
const paymentMethod = ref('')
const showCheckoutPrompt = ref(false)
const couponCode = ref('')
const couponError = ref('')

const goBack = () => {
  router.push('/main')
}

const removeFromCart = (item) => {
  cartStore.removeItem(item.id, item.storeId)
}


const closeCheckoutPrompt = () => {
  showCheckoutPrompt.value = false
  cartStore.clearCart() 
  router.push('/main') 
}

const getImageUrl = (name) => {
  if (!name) return ''
  try {
    return new URL(`../assets/${name}`, import.meta.url).href
  } catch (error) {
    console.error("Error resolving image:", name, error)
    return ''
  }
}

const applyCoupon = () => {
  if (cartStore.applyCoupon(couponCode.value)) {
    couponError.value = ''
    couponCode.value = ''
  } else {
    couponError.value = 'Invalid or already used coupon'
  }
}

const removeCoupon = () => {
  cartStore.removeCoupon()
}

const checkout = async () => {
  if (paymentMethod.value && cartStore.items.length > 0) {
    try {
      const orderData = {
        items: cartStore.items,
        totalPrice: cartStore.totalPrice,
        discountedTotal: cartStore.appliedCoupon ? cartStore.discountedTotalPrice : null,
        paymentMethod: paymentMethod.value,
      }

      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to save order.')
      }

      const result = await response.json()
      console.log('Order saved:', result)

      showCheckoutPrompt.value = true
      cartStore.clearCart()
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('Failed to process the order. Please try again.')
    }
  }
}


</script>

<style scoped>
.back-button-x {
  position: absolute;
  top: 1rem; /* Adjust based on your layout */
  left: 3rem; /* Adjust based on your layout */
  font-size: 1.5rem;
  font-weight: bold;
  color: #000000; /* Red color for a clear indication */
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
}
.back-button-x:hover {
  color: #dc2626; /* Darker red on hover */
}
.back-button-x:focus {
  outline: none;
}
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.cart-title {
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
  text-align: center;
}

.cart-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 40px;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 500;
  color: #64748b;
}

.cart-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 40px;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
}

.item-product {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.item-store {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.875rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.quantity-btn:hover {
  background: #f8fafc;
}

.quantity-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.remove-btn {
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
}

.remove-btn:hover {
  color: #ef4444;
}

.order-summary {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
}

.order-summary h2 {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 500;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #64748b;
}

.coupon-code {
  margin: 1.5rem 0;
  padding: 1.5rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.coupon-input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.apply-coupon-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-coupon-btn:hover {
  background: #2563eb;
}

.coupon-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.applied-coupon {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.remove-coupon-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0;
  font-size: 0.875rem;
  text-decoration: underline;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.payment-options {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.payment-options h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.payment-option {
  margin-bottom: 0.5rem;
}

.payment-option label {
  margin-left: 0.5rem;
}

.checkout-btn {
  width: 100%;
  background: #16a34a;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-btn:hover {
  background: #15803d;
}

.checkout-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  grid-column: 1 / -1;
}

.checkout-prompt {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.prompt-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.close-prompt-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-prompt-btn:hover {
  background-color: #15803d;
}

.discounted-price s {
  color: #64748b;
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .cart-container {
    grid-template-columns: 1fr;
  }

  .cart-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .item-price, .item-quantity, .item-total {
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
  }

  .item-price::before {
    content: 'Price:';
    color: #64748b;
  }

  .item-quantity::before {
    content: 'Quantity:';
    color: #64748b;
  }

  .item-total::before {
    content: 'Total:';
    color: #64748b;
  }

  .remove-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    color: #ef4444;
  }
  .back-button-x{
    left: 1rem;
    padding-bottom: 1rem;
  }
}
</style>

