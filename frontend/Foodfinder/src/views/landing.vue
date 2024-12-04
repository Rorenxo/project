<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <div class="food-store">
    <nav class="navbar">
      <div class="logo">
        <img src="@/assets/public icons/logo.png" alt="Foodie Finder" style="height:70px; width: auto;">
      </div>
      <ul class="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#stores">Stores</a></li>
        <li><a href="/login">Register</a></li>
        <div class="box">
          <li><a href="/login" class="login">Login</a></li>
        </div>
      </ul>
    </nav>

    <div class="main-content">
      <!-- Home Section -->
      <section id="home" class="home">
        <h1>LET'S FIND YOUR FOOD</h1>
        <div id="map" class="map-container">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d36691.179135002974!2d120.29477305733364!3d14.842919766125354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396711b9c32216b%3A0xa080c3d36f2963a7!2sOlongapo%2C%20Zambales!5e0!3m2!1sen!2sph!4v1730014145286!5m2!1sen!2sph" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>

      <!-- Products Section -->
      <section id="products" class="products">
        <h2>Popular Dishes</h2>
        <p>Recommended and Top Trending Foods This Week!</p>
        <div class="product-grid">
          <div v-for="product in products" :key="product.id" class="product-card">
            <img :src="getImageUrl(product.image)" :alt="product.name">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <p class="price">price: ₱{{ product.price }}</p>
            <button @click="showLoginPrompt" class="add-to-cart">Add to Cart</button>
          </div>  
        </div>
      </section>

      <!-- Process Section -->
      <section id="process" class="process">
        <h2>Our Process</h2>
        <div class="process-steps">
          <div v-for="step in processSteps" :key="step.id" class="step">
            <div class="step-number">
              <i :class="step.icon"></i>
            </div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
        <div class="imagefoot"></div>
      </section>

      <!-- Food Selection Section -->
      <section id="food" class="food">
        <div class="food-header">
          <h2>Food Selection</h2>
          <div class="category-filters">
            <button 
              class="filter-btn"
              :class="{ active: selectedCategory === 'all' }"
              @click="selectCategory('all')"
            >
              All
            </button>
            
            <!-- Cuisine Dropdown -->
            <div class="dropdown" :class="{ active: showCuisines }">
              <button class="filter-btn" @click="toggleDropdown('cuisines')">
                Cuisines <i class="fa-solid fa-caret-down"></i>
              </button>
              <div v-if="showCuisines" class="dropdown-content">
                <button 
                  v-for="cuisine in cuisines" 
                  :key="cuisine"
                  class="dropdown-item"
                  @click="selectCategory(cuisine.toLowerCase())"
                >
                  {{ cuisine }}
                </button>
              </div>
            </div>
            
            <!-- Drinks Dropdown -->
            <div class="dropdown" :class="{ active: showDrinks }">
              <button class="filter-btn" @click="toggleDropdown('drinks')">
                Drinks <i class="fa-solid fa-caret-down"></i>
              </button>
              <div v-if="showDrinks" class="dropdown-content">
                <div class="dropdown-section">
                  <h4>Alcoholic</h4>
                  <button 
                    v-for="drink in alcoholicDrinks" 
                    :key="drink"
                    class="dropdown-item"
                    @click="selectCategory(drink.toLowerCase())"
                  >
                    {{ drink }}
                  </button>
                </div>
                <div class="dropdown-section">
                  <h4>Non-Alcoholic</h4>
                  <button 
                    v-for="drink in nonAlcoholicDrinks" 
                    :key="drink"
                    class="dropdown-item"
                    @click="selectCategory(drink.toLowerCase())"
                  >
                    {{ drink }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Shakes and Sweets Dropdown -->
            <div class="dropdown" :class="{ active: showShakesSweets }">
              <button class="filter-btn" @click="toggleDropdown('shakesSweets')">
                Shakes & Sweets <i class="fa-solid fa-caret-down"></i>
              </button>
              <div v-if="showShakesSweets" class="dropdown-content">
                <button 
                  v-for="item in shakesAndSweets" 
                  :key="item"
                  class="dropdown-item"
                  @click="selectCategory(item.toLowerCase())"
                >
                  {{ item }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="food-list">
          <div v-for="item in filteredItems" :key="item.id" class="food-card" :data-category="item.category">
            <img :src="getImageUrl(item.image)" :alt="item.name">
            <div class="food-details">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
              <p class="price">Price: ₱{{ item.price }}</p>
              <button @click="showLoginPrompt" class="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Stores Section -->
      <section id="stores" class="stores">
        <div class="stores-header">
          <h2>Featured Restaurants</h2>
          <nav class="cuisine-nav">
            <ul>
              <li>
                <a href="#" 
                   @click.prevent="filterStores('all')"
                   :class="['cuisine-filter', { active: selectedCuisine === 'all' }]"
                   data-cuisine="all">
                  All
                </a>
              </li>
              <li v-for="cuisine in cuisines" :key="cuisine">
                <a href="#" 
                   @click.prevent="filterStores(cuisine)"
                   :class="['cuisine-filter', { active: selectedCuisine === cuisine.toLowerCase() }]"
                   :data-cuisine="cuisine.toLowerCase()">
                  {{ cuisine }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="store-list">
          <div
            v-for="store in filteredStores" 
            :key="store.id" 
            class="store-card" 
            :data-cuisine="store.cuisine"
          >
            <img :src="getImageUrl(store.image)" :alt="store.name">
            <div class="store-details">
              <h3>{{ store.name }}</h3>
              <p class="address">{{ store.address }}</p>
              <button @click="showLoginPrompt" class="visit-btn">Visit</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const products = ref([
  {
    id: 1,
    name: 'Arancini',
    description: 'Fried rice balls, often cheesy',
    price: 550,
    image: 'foods/arancini.jpg',
    category: 'italian'
  },
  {
    id: 2,
    name: 'Bibimbap',
    description: 'Mixed rice with veggies and egg',
    price: 350,
    image: 'foods/bibimbap.jpg',
    category: 'korean'
  },
  {
    id: 3,
    name: 'Bouillabaisse',
    description: 'Fish stew with herbs and spices',
    price: 400,
    image: 'foods/Bouillabaisse.jpg',
    category: 'french'
  },
  {
    id: 4,
    name: 'Kung Pao Chicken',
    description: 'Spicy chicken with peanuts',
    price: 150,
    image: 'foods/Kung Pao Chicken.jpg',
    category: 'chinese'
  },
  {
    id: 5,
    name: 'Peking duck',
    description: 'Crispy duck served with pancakes',
    price: 250,
    image: 'foods/Peking duck.jpg',
    category: 'chinese'
  },
  {
    id: 6,
    name: 'Korean Spicy Chicken',
    description: 'Spicy marinated chicken dish',
    price: 500,
    image: 'foods/korean-Spicy-Chicken.jpg',
    category: 'korean'
  }
])

const processSteps = ref([
  { id: 1, icon: 'fas fa-utensils', title: 'Choose Your Food', description: 'Browse our wide selection of delicious foods.' },
  { id: 2, icon: 'fas fa-clipboard-list', title: 'Place Your Order', description: 'Select your items and proceed to checkout.' },
  { id: 3, icon: 'fas fa-credit-card', title: 'Make Payment', description: 'Pay securely using your preferred method.' },
  { id: 4, icon: 'fas fa-smile', title: 'Enjoy Your Meal', description: 'Receive your food and enjoy!' }
])

const foods = ref([
{
    id: 1,
    name: 'Arancini',
    description: 'Fried rice balls, often cheesy',
    price: 550,
    image: 'foods/arancini.jpg',
    category: 'italian'
  },
  {
    id: 2,
    name: 'Bibimbap',
    description: 'Mixed rice with veggies and egg',
    price: 350,
    image: 'foods/bibimbap.jpg',
    category: 'korean'
  },
  {
    id: 3,
    name: 'Bouillabaisse',
    description: 'Fish stew with herbs and spices',
    price: 400,
    image: 'foods/Bouillabaisse.jpg',
    category: 'french'
  },
  {
    id: 4,
    name: 'Kung Pao Chicken',
    description: 'Spicy chicken with peanuts',
    price: 150,
    image: 'foods/Kung Pao Chicken.jpg',
    category: 'chinese'
  },
  {
    id: 5,
    name: 'Peking duck',
    description: 'Crispy duck served with pancakes',
    price: 250,
    image: 'foods/Peking duck.jpg',
    category: 'chinese'
  },
  {
    id: 6,
    name: 'Korean Spicy Chicken',
    description: 'Spicy marinated chicken dish',
    price: 500,
    image: 'foods/korean-Spicy-Chicken.jpg',
    category: 'korean'
  },
  {
    id: 7,
    name: 'Dim sum',
    description: 'Steamed or fried bite-sized delights.',
    price: 220,
    image: 'foods/Dim sum.jpg',
    category: 'chinese'
  },
  {
    id: 8,
    name: 'tteokbokki',
    description: 'Simmered rice cake',
    price: 150,
    image: 'foods/tteokbokki.jpg',
    category: 'korean'
  },
  {
    id: 9,
    name: 'Cicoria Ripassata',
    description: 'Sautéed chicory with garlic and olive oil.',
    price: 120,
    image: 'foods/Cicoria Ripassata.jpg',
    category: 'italian'
  }
])

const newItems = ref([
  {
    id: 10,
    name: 'Bière artisanale',
    description: 'Locally brewed craft beer with unique flavors and artisanal quality.',
    price: 90,
    image: 'foods/bière artisanale.jpg',
    category: ['beer', 'french']
  },
  {
    id: 11,
    name: 'Red Wine',
    description: 'Rich and velvety red wine with fruity and earthy notes.',
    price: 350,
    image: 'foods/Vinrouge.jpg',
    category: ['wine', 'french'] 
  },
  {
    id: 12,
    name: 'Limonata',
    description: 'Lemon juice mixed with water and sugar',
    price: 50,
    image: 'foods/Limonata.jpg',
    category: ['juice', 'italian' ]
  },
  {
    id: 13,
    name: 'Volvic Strawberry',
    description: 'Refreshing natural mineral water infused with a hint of strawberry flavor.',
    price: 30,
    image: 'foods/Volvic.jpg',
    category: ['water', 'french' ]
  },
  {
    id: 14,
    name: 'Ttalgi Shake',
    description: 'Made with fresh strawberries, milk, and sugar, blended until creamy and sweet',
    price: 150,
    image: 'foods/Ttalgi Shake.jpg',
    category: ['milkshakes', 'korean' ]
  },
  {
    id: 15,
    name: 'Strawberry Ice Cream',
    description: 'Creamy strawberry ice cream',
    price: 120,
    image: 'foods/Bungeoppang Ice Cream.jpg',
    category: ['ice cream', 'korean' ]
  },
  {
    id: 16,
    name: 'Negroni',
    description: 'Italian cocktail with gin, sweet vermouth, and Campari',
    price: 100,
    image: 'foods/negroni.jpg',
    category: ['cocktails', 'italian']
  },  
  {
    id: 17,
    name: 'Sesame Cookies',
    description: 'Crunchy, nutty treats made with sesame seedsi',
    price: 40,
    image: 'foods/Sesame Cookies.jpg',
    category: ['cookies', 'chinese']
  },
  {
    id: 18,
    name: 'Tiramisu',
    description: 'luscious, coffee-flavored Italian dessert with layers of creamy mascarpone and cocoa.',
    price: 90,
    image: 'foods/Tiramisu.jpg',
    category: ['cakes', 'italian']
  }, 
  {
    id: 19,
    name: 'Jianlibao',
    description: 'Chinese carbonated soft drink, known for its sweet, citrus flavor and energizing taste',
    price: 40,
    image: 'foods/Jianlibao.jpg',
    category: ['soda', 'chinese']
  },
])

const allItems = computed(() => [...foods.value, ...newItems.value])

const foodCategories = ref(['All', 'Italian', 'Korean', 'Chinese', 'French'])
const selectedCategory = ref('all')

const toggleDropdown = (dropdown) => {
  switch (dropdown) {
    case 'cuisines':
      showCuisines.value = !showCuisines.value
      showDrinks.value = false
      showShakesSweets.value = false
      break
    case 'drinks':
      showDrinks.value = !showDrinks.value
      showCuisines.value = false
      showShakesSweets.value = false
      break
    case 'shakesSweets':
      showShakesSweets.value = !showShakesSweets.value
      showCuisines.value = false
      showDrinks.value = false
      break
  }
}

const selectCategory = (category) => {
  selectedCategory.value = category
  showCuisines.value = false
  showDrinks.value = false
  showShakesSweets.value = false
}

const cuisines = ref(['Italian', 'Korean', 'Chinese', 'French'])
const alcoholicDrinks = ref(['Beer', 'Wine', 'Cocktails'])
const nonAlcoholicDrinks = ref(['Soda', 'Juice', 'Water'])
const shakesAndSweets = ref(['Milkshakes', 'Ice Cream', 'Cakes', 'Cookies'])

const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return allItems.value
  }
  return allItems.value.filter(item => 
    Array.isArray(item.category) 
      ? item.category.includes(selectedCategory.value)
      : item.category === selectedCategory.value
  )
})

const stores = ref([
  {
    id: 1,
    name: 'Crab and Belly',
    address: 'Taft Road, Lincoln Steeet Subic Bay Freeport Zone',
    image: 'stores/italian restaurant.jpg',
    cuisine: 'italian',
  },
  {
    id: 2,
    name: 'Gourmet Garage Subic',
    address: 'Subic Bay Freeport Zone, Olongapo City',
    image: 'stores/Korean resto.jpg',
    cuisine: 'korean',
  },
  {
    id: 3,
    name: 'Liberty Sports Bar & Grill',
    address: 'Alava Quay SBFZ, Global Commercial Center, Waterfront Rd',
    image: 'stores/Chinese Resto.jpg',
    cuisine: 'chinese',
  },
  {
    id: 4,
    name: 'French Brew Café',
    address: 'Tanguille Street, Masinloc, Zambales',
    image: 'stores/French.jpg',
    cuisine: 'french',
  }
])

const selectedCuisine = ref('all')

const filterStores = (cuisine) => {
  selectedCuisine.value = cuisine.toLowerCase()
}

const filteredStores = computed(() => {
  if (selectedCuisine.value === 'all') {
    return stores.value
  }
  return stores.value.filter(store => store.cuisine === selectedCuisine.value)
})

function getImageUrl(name) {
  try {
    return new URL(`../assets/${name}`, import.meta.url).href;
  } catch (error) {
    console.error("Error resolving image:", name, error);
    return '';
  }
}

const showCuisines = ref(false)
const showDrinks = ref(false)
const showShakesSweets = ref(false)

const showLoginPrompt = () => {
  alert('Please login first to access this feature.')
  router.push('/login')
}

</script>

<style scoped>

</style>




