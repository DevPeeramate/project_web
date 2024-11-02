<template>
<header class="black">
  <header>
    <div class="container">
      <div class="header-info">
        <!-- ส่วนหัวของ title -->
        <div class="about-title">
          <h3>Welcome to the cutting edge of innovation</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
            assumenda quibusdam earum error repellendus culpa sit doloribus
            doloremque, dolore cumque architecto accusantium ratione
            necessitatibus minima ipsum voluptas modi, vel, eveniet officiis
            unde. Minima, iste tenetur?
          </p>
        </div>
      </div>
    </div>
  </header>

  <div class="header-backgroud">
    <div class="container">
        <section class="process-step">
          <div class="image-container">
            <img
              src="https://images.stockcake.com/public/0/c/c/0cc1220a-1283-4029-83ea-60f92021bfec_large/cozy-room-interior-stockcake.jpg"
              alt="Plan"
            />
          </div>
          <div class="text-container">
            <h2>
              B E D R O O M <br />
              FOR TWO
            </h2>
            <p>Lay out the blueprint</p>
            <p>
              Lay out the usage patterns of different areas in the room to make
              them most suitable for the customers' lifestyles, making it an
              area that most suits the residents' lifestyles.
            </p>
          </div>
        </section>

        <section class="process-step-2">
          <div class="image-container">
            <img
              src="https://images.stockcake.com/public/6/0/a/60aacad3-cbed-4747-868b-d8f3c574ddd5_large/cozy-bedroom-interior-stockcake.jpg"
              alt="Isometric"
            />
          </div>
          <div class="text-container-2">
            <h2>
              B E D R O O M <br />
              FOR ONE
            </h2>
            <p>Isometric</p>
            <p>
              3D isometric drawings to help customers see the room clearly and
              understand all functions of the room, reducing decoration errors
              and coming out as much as possible according to the customer's
              imagination, allowing customers to get the room they want as they
              intended, perfectly.
            </p>
          </div>
        </section>

        <section class="process-step">
          <div class="image-container">
            <img
              src="https://images.stockcake.com/public/2/4/2/24294de4-cb4f-4f3c-92fb-f3f869d3aeb5_large/cozy-urban-loft-stockcake.jpg"
              alt="Imagine to Realistic"
            />
          </div>
          <div class="text-container">
            <h2>
              B E D R O O M <br />
              FOR FOUR
            </h2>
            <p>From imagination to real room decoration</p>
          </div>
        </section>

      <!-- <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div> -->
    </div>
  </div>
</header>
  
</template>

<script>

import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "HomeComponent",
  data() {
    return {
      memName: null,
      role: null,
      backendMessage: null,
    };
  },
  mounted() {
    // this.chkSession();    
 
  },

  methods: {
    // async chkSession() {
    //   try {
    //     await axios.get(`http://localhost:3000/session`).then((res) => {
    //       this.memEmail = res.data.email;
    //       this.memName = res.data.name;
    //       this.role = res.data.role;
    //       // sessionStorage.setItem("memName", res.data.name);
    //     });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
    
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "DM Sans", sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
}

/* ------------------------------------------ ส่วนของ about ------------------------------------------*/
.header-info {
  margin-top: 5rem;
}

.about-title h3 {
  text-align: center;
  font-size: 2rem;
  background: linear-gradient(45deg, #8e68d3, #8837d4, #d63a3a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 80px rgba(192, 219, 255, 0.377),
    0 0 32px rgb(65 120 255 / 24%);
}

.about-title p {
  text-align: center;
  color: #0707079a;
}

/* ------------------------------------------ grid ส่วนของ img ------------------------------------------*/
.process-step {
  display: flex;
  flex-wrap: wrap;
  background: linear-gradient(45deg, #3a3a3a, #2c2c2c, #000000);
  align-items: center;
  margin-bottom: 50px;
  border-radius: 20px; /* บนซ้ายและล่างขวาโค้ง */
  margin-top: 5rem;
}

.process-step-2 {
  display: flex;
  flex-wrap: wrap;
  background: linear-gradient(223deg, #3a3a3a, #2c2c2c, #000000);
  flex-direction: row-reverse; /* ทำให้รูปภาพอยู่ขวา */
  align-items: center;
  margin-bottom: 50px;
  border-radius: 20px;
  margin-top: 5rem;
}

.process-step p {
  color: #eeeeee;
}

.process-step-2 p {
  color: #eeeeee;
}

.image-container {
  flex: 1;
  min-width: 500px;
  padding: 10px;
}

.image-container img {
  width: 100%;
  height: auto;
  border: 2px solid #ffffff00;
  border-radius: 10px;
}

.text-container {
  flex: 2;
  padding: 20px;
}

.text-container-2 {
  flex: 2;
  padding: 20px;
  text-align: right;
}

h2 {
  font-size: 28px;
  letter-spacing: 3px;
  color: #ffffff;
  margin-bottom: 10px;
  font-weight: bold;
}

p {
  font-size: 16px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .process-step {
    flex-direction: column;
    text-align: center;
  }

  .text-container {
    padding: 10px;
  }
}

/* .black {
  background-color: #ffff;
} */
</style>