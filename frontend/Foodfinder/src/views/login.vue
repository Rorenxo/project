<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="back-button" @click="goBack">← Back</div>
      <div class="little">
    <img :src="('/foodie logo copy 2.png')" alt="little" />
      </div>
      
      <div id="register" v-if="isRegistering">
        <h2>Create Account</h2>
        <form @submit.prevent="register">
          <input 
            type="text" 
            v-model="registerUsername" 
            placeholder="Username"
          >
          <input 
            type="email" 
            v-model="registerEmail" 
            placeholder="Email"
          >
          <input 
            type="password" 
            v-model="registerPassword" 
            placeholder="Password"
          >
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? 
          <a href="#" @click.prevent="isRegistering = false">Login here</a>
        </p>
      </div>

      <div id="login" v-else>
        <h2>Welcome back!</h2>
        <form @submit.prevent="login">
          <input 
            type="text" 
            v-model="loginUsername" 
            placeholder="Username"
          >
          <input 
            type="password" 
            v-model="loginPassword" 
            placeholder="Password"
          >
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? 
          <a href="#" @click.prevent="isRegistering = true">Register here</a>
        </p>
      </div>

      <p v-if="message" :class="{ 'error-message': error, 'success-message': !error }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isRegistering = ref(true)
const registerUsername = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const loginUsername = ref('')
const loginPassword = ref('')
const message = ref('')
const error = ref(false)

const register = async () => {
  try {
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: registerUsername.value,
        email: registerEmail.value,
        password: registerPassword.value
      }),
    });
    const data = await response.json();
    message.value = data.message;
    error.value = !response.ok;
    if (response.ok) {
      setTimeout(() => {
        isRegistering.value = false;
      }, 1500);
    }
  } catch (err) {
    message.value = 'An error occurred during registration';
    error.value = true;
  }
};

const login = async () => {
  try {
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginUsername.value,
        password: loginPassword.value
      }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token); // Store the token
      router.push('/main'); // Redirect to main page
    } else {
      message.value = data.message;
      error.value = true;
    }
  } catch (err) {
    message.value = 'An error occurred during login';
    error.value = true;
  }
};
const goBack = () => {
  router.push('landing'); // Replace '/' with the route name or path for your landing page
};





</script>

<style scoped>
.back-button {
  font-size: 1rem;
  color: #000000;
  cursor: pointer;
  text-align: left;
  margin-bottom: 1rem; /* Space below the back button */
  display: inline-block;
}

.back-button:hover {
  text-decoration: underline;
  color: #b51212;
}
.little{
  text-align: center
}
.little img{
  width: 150px;
  height: auto; 
  border-radius: 5px; 
}
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('/bg.jpg'); 
  background-size: cover; 
  background-position: center;
  font-family: Arial, sans-serif;
}

.auth-box {
  background-color: rgb(255, 255, 255);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0px 6px rgba(0, 0, 0, 0.7);
  width: 100%;
  max-width: 400px;
}


h2 {
  font-size: 1.4rem;
  color: #e60023;
  text-align: center;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #e60023;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #b8021d;
}

p {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

a {
  color: #1877f2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.error-message {
  color: #d32f2f;
  text-align: center;
  margin-top: 1rem;
}

.success-message {
  color: #388e3c;
  text-align: center;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .auth-box {
    width: 90%;
    max-width: none;
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  input, button {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 450px) {
  .auth-box {
    width: 95%;
    padding: 1rem;
  }

  .little img {
    width: 120px;
  }

  h2 {
    font-size: 1.1rem;
  }

  input, button {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .back-button {
    font-size: 0.9rem;
  }

  p {
    font-size: 0.9rem;
  }
}
</style>