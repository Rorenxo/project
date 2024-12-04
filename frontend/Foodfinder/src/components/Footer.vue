<template>
  <section class="footer">
    <div class="box-container">
      <div class="box">
        <img src="@/assets/public icons/logo.png" alt="logo" />
        <p>WE ARE THE FOODIE FINDERS AND <br />WE ARE HAPPY YOU USE OUR SITE/APP</p>
        <div class="share">
          <a href="https://www.facebook.com/profile.php?id=61568776087339" target="_blank" class="fab fa-facebook"></a>
          <a href="#" class="fab fa-twitter"></a>
          <a href="#" class="fab fa-instagram"></a>
          <a href="#" class="fab fa-linkedin"></a>
        </div>
      </div>

      <div class="box">
        <h3>Contact Information</h3>
        <a href="#" class="links"> <i class="fas fa-phone"></i>09-4545-9392</a>
        <a href="mailto:foodiefinderdcode@gmail.com" class="links"> <i class="fas fa-envelope"></i>foodiefindercode@gmail.com</a>
        <a href="#" class="links"> <i class="fas fa-map-marker-alt"></i>Olongapo City, Philippines</a>
      </div>

      <div class="box">
        <h3>Quick links</h3>
        <a href="#home" class="links"> <i class="fas fa-arrow-right"></i>Home</a>
        <a href="#products" class="links"> <i class="fas fa-arrow-right"></i>Products</a>
        <router-link to="/login" class="links"> <i class="fas fa-arrow-right"></i>Login</router-link>
        <router-link to="/login#register" class="links"> <i class="fas fa-arrow-right"></i>Register</router-link>
      </div>
    </div>
    <div class="low">
      &copy; 2024 <span>Foodie Finders</span>. All rights reserved ┃ Crafted by <span>The D'code</span>
    </div>
  </section>
</template>
