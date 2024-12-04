<template>
  <div class="food-store">
    <nav class="navbar">
      <div class="logo">
        <img src="@/assets/public icons/logo.png" alt="Foodie Finder" style="height:70px; width: auto;">
      </div>
      <ul class="nav-links">
        <i class="fa-solid fa-bars"></i>
        <li><router-link to="/main#home">Home</router-link></li>
        <li><router-link to="/main#stores">Stores</router-link></li>
        <li><router-link to="/order">My Orders</router-link></li>
        <div class="box">
          <li><router-link to="/login" class="login">Logout</router-link></li>
        </div>
        <div class="back-button" @click="goBack">← </div>

      </ul>
    </nav>
    <div class="container">
      <div class="store-info">
        <div class="store-details">
          <h2>{{ storeName }}</h2>
          <p>{{ storeAddress }}</p>
        </div>
        <div class="store-image">
          <img :src="getImageUrl(storeImage)" :alt="storeName">
        </div>
      </div>

      <div class="cart">
        <h3>My Cart</h3>
        <div v-if="cartStore.items.length === 0" class="cart-empty">
          Your cart is empty
        </div>
        <div v-else>
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div>
              <h4>{{ item.name }}</h4>
              <p>₱{{ item.price }} x {{ item.quantity }}</p>
            </div>
            <button @click="removeFromCart(item)" class="remove-button">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="cart-total">
            <div>Total: ₱{{ cartStore.totalPrice }}</div>
            <button @click="addToOrder" id="orderButton" class="add-to-order-button">Add to My Order</button>
          </div>
        </div>
      </div>

      <div class="products-grid">
        <div v-for="product in storeProducts" :key="product.id" class="product-card">
          <img :src="getImageUrl(product.image)" :alt="product.name" />
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="product-action">
              <span class="price">₱{{ product.price }}</span>
              <button @click="addToCart(product)" class="add-to-cart-button">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Notification message -->
    <transition name="fade">
  <div v-if="showAddToCartNotification" class="add-to-cart-notification">
    {{ addToCartNotificationMessage }}
  </div>
</transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/cart/cart'

const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()
const showNotification = ref(false)

const goBack = () => {
  router.push('/main'); 
};

const addToOrder = () => {
  cartStore.addToOrder()
  showNotification.value = true
    router.push('/order')
}

const props = defineProps({
  storeName: String,
  storeAddress: String,
  storeImage: String,
  storeProducts: Array
})

const showAddToCartNotification = ref(false);
const addToCartNotificationMessage = ref("");

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    storeId: route.params.storeId,
    storeName: props.storeName,
    image: product.image
  });

  // Show the notification
  addToCartNotificationMessage.value = `"${product.name}" has been added to your cart!`;
  showAddToCartNotification.value = true;

  // Hide the notification after 2 seconds
  setTimeout(() => {
    showAddToCartNotification.value = false;
  }, 2000);

};


const cart = ref([])
const removeFromCart = (item) => {
  cartStore.removeItem(item.id, item.storeId)
}

const cartItems = computed(() => cartStore.items)
const cartTotal = computed(() => cartStore.totalPrice)

function getImageUrl(name) {
  if (!name) return '';
  try {
    // Handle both relative and absolute paths
    if (name.startsWith('/')) {
      return name;
    }
    return new URL(`/src/assets/${name}`, import.meta.url).href;
  } catch (error) {
    console.error("Error resolving image:", name, error);
    return '';
  }
}

</script>

<style scoped>
.back-button{
  display: none;
  position: fixed;
  right: 10px;
  top: 15px;
  font-size: 1.5rem;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--text-color);
  z-index: 1000;
}
.food-store {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  min-height: 100vh;
}

.navbar {
  background-color: #f1f1f1;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  top: 0;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  display: flex;
}

.nav-links li {
  margin-left: 1rem;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  transition: color var(--transition-speed);
  position: relative;
  font-size: 1.1rem;
}

.nav-links .fa-solid {
  display: none;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease-in-out;
}

.nav-links a:hover::after {
  width: 100%;
}

.nav-links .box a {
  border: 1px solid var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-links .login::after {
  content: none;
}

.nav-links .box a:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  text-decoration: none;  
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.store-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem; 
  flex-wrap: wrap; 
}

.store-details {
  flex: 1; 
  min-width: 0; 
}

.store-details h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  word-wrap: break-word; 
  overflow: hidden; 
  text-overflow: ellipsis;
}

.store-details p {
  color: #666;
  margin: 0;
  word-wrap: break-word; 
}

.store-image {
  flex-shrink: 0; 
  width: 250px;
  height: 138px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center; 
  background-color: #f0f0f0; 
}

.store-info-center {
  text-align: center; 
}

.store-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.cart h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.cart-empty {
  color: #666;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; 
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.cart-item h4 {
  margin: 0;
  margin-bottom: 0.25rem;
}

.cart-item p {
  margin: 0;
  padding:0;
  align-self: flex-start;
  color: #666;
  font-size: 0.9rem;
}

.remove-button {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 0.5rem; 
}

.remove-button .fas {
  margin-left: 0;
}

.cart-total {
  display: flex;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
  justify-content: space-between;
  align-items: center;
}

#orderButton {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

#orderButton:hover {
  background-color: #b02e2e;
}

.cart-total #orderButton {
  text-align: right;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
  text-align: center;
}

.product-info h3 {
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.product-info p {
  color: #666;
  margin: 0 0 1rem 0;
}

.product-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--text-color);
}

.add-to-cart-button {
  background-color: #e53e3e;
  text-align: center;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-to-cart-button:hover {
  background-color: #c53030;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 16px;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.add-to-cart-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.add-to-order-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


@media (max-width: 768px) {
  .back-button{
    display: block;
}
  .store-info {
    flex-direction: column;
  }

  .store-image {
    margin-top: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>