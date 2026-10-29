<script setup lang="ts">
function toTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-grid">
      <div>
        <h2>We would love to hear from you.</h2>
        <p>
          Feel free to reach out if you want to collaborate with us, or simply
          have a chat.
        </p>
        <a class="ghost-btn" href="mailto:contact@monopo.london">
          contact@monopo.london →
        </a>
      </div>
      <div>
        <h3>Our Address</h3>
        <p>Unit 16C, Perseverance Works</p>
        <p>38 Kingsland Road</p>
        <p>E2 8DD, London</p>
        <p>United Kingdom</p>
        <p>VAT: 319656475</p>
        <p>Company no. 11843590</p>
        <p>Registered in England & Wales</p>
      </div>
      <div>
        <h3>Follow us</h3>
        <ul>
          <li>
            <a href="https://www.instagram.com/monopo_london" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/company/monopo/" target="_blank" rel="noreferrer">
              Linkedin
            </a>
          </li>
          <li>
            <a href="https://monopo.co.jp/" target="_blank" rel="noreferrer">↗ Monopo TKY</a>
          </li>
          <li>
            <a href="https://monopo.nyc/" target="_blank" rel="noreferrer">↗ Monopo NYC</a>
          </li>
          <li>
            <a href="https://poweredby.tokyo/" target="_blank" rel="noreferrer">
              ↗ POWERED BY TOKYO
            </a>
          </li>
        </ul>
      </div>
      <nav aria-label="Footer">
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/work">Work</NuxtLink></li>
          <li><NuxtLink to="/services">Services</NuxtLink></li>
          <li><NuxtLink to="/team">Team</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact</NuxtLink></li>
          <li><NuxtLink to="/press">PRESS & NEWS</NuxtLink></li>
          <li><NuxtLink to="/policy">Privacy policy</NuxtLink></li>
        </ul>
      </nav>
    </div>
    <button class="top-btn" type="button" @click="toTop">top ↑</button>
  </footer>
</template>
