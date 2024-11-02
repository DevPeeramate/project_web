<template>
  <!-- nav bar -->
  <header class="navmain">
    <div class="container">
      <nav>
        <!-- Branding -->
        <div class="login-logo">
          <router-link to="/" class="navbar-brand float-left">
            <img src="./assets/image/logo.png" alt="Logo" />
            <!-- <h5>Travel</h5> -->
          </router-link>
        </div>
        <!-- Navigation Links -->
        <ul class="main-menu">
          <li class="nav-item">
            <router-link to="/" class="nav-link">HOME</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/room" class="nav-link">ROOMS</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/myroom" class="nav-link">MY ROOM</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/review" class="nav-link">REVIEW</router-link>
          </li>
        </ul>

        <ul class="account-menu">
          <li class="nav-item">
            <router-link to="/pageMember" style="text-decoration: none">
              <div class="nav-link fw-bold">{{ memName }}</div>
            </router-link>
          </li>
          <li class="nav-item" v-if="memName == null">
            <router-link to="/login" class="nav-link">LOGIN</router-link>
          </li>
          <li class="nav-item" v-else>
            <a href="#" @click="memlogout" style="text-decoration: none">
              <div class="nav-link">LOGOUT</div>
            </a>
          </li>
          <li class="nav-item" v-if="role == 'admin'">
            <router-link to="/ManageRoom" style="text-decoration: none">
              <a class="nav-link" href="#">Manage Rooms</a></router-link
            >
          </li>
          <li class="nav-item" v-if="role == 'admin'">
            <router-link to="/ManageReview" style="text-decoration: none">
              <a class="nav-link" href="#">Manage Reviews</a></router-link
            >
          </li>
          <li class="nav-item" v-else>
            <a href="#" style="text-decoration: none">
              <div class="nav-link"></div>
            </a>
          </li>
        </ul>


        <!-- <li class="nav-item">
              <router-link to="/register" class="nav-link"
                >สมัครสมาชิก</router-link
              >
            </li>
            <li class="nav-item">
              <i class="bi bi-list">
                <ul>
                  <li class="nav-item">
                    <router-link to="/admin" class="nav-link">Admin</router-link>
                  </li>
                </ul>
              </i>
            </li> -->
      </nav>
    </div>
  </header>

  <!-- Router view -->
  <div class="container mt-5">
    <router-view></router-view>
  </div>
</template>

<script>
import { EventBus } from "@/event-bus";
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "MainMenu",
  data() {
    return {
      memName: null,
      role: null,
      backendMessage: null,
    };
  },
  mounted() {
    this.chkSession();
    // เมื่อเริ่ม mount ให้อ่านค่าจาก sessionStorage
    this.memName = sessionStorage.getItem("memName");
    // เมื่อ EventBus เกิดสัญญาณ loginok ให้อ่านข้อมูลจาก sessionStorage ใหม่
    EventBus.on("loginok", () => {
      axios.get(`http://localhost:3000/session`).then((res) => {
        this.memEmail = res.data.email;
        this.memName = res.data.name;
        this.role = res.data.role;
      });
      this.memName = sessionStorage.getItem("memName");
    });
    EventBus.on("deleteok", () => {
      this.memName = null;
    });
  },

  methods: {
    async chkSession() {
      try {
        await axios.get(`http://localhost:3000/session`).then((res) => {
          this.memEmail = res.data.email;
          this.memName = res.data.name;
          this.role = res.data.role;
          // sessionStorage.setItem("memName", res.data.name);
        });
      } catch (err) {
        console.log(err);
      }
    },
    async memlogout() {
      const cf = window.confirm("ต้องการออกจากระบบ?");
      if (cf) {
        try {
          this.role = "";
          console.log("error");
          const response = await axios.get(`http://localhost:3000/logout`);
          this.backendMessage = response.data.messageLogout;
          console.log(this.backendMessage);
          if (this.backendMessage == "success") {
            console.log("error1");
            // ลบเฉพาะ sessionStorage ที่ระบุ
            // sessionStorage.removeItem('memName');
            // ลบ sessionStorage ทั้งหมด
            sessionStorage.clear();
            this.memName = null;
            this.$router.push("/login");
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
  beforeUnmount() {
    EventBus.off("loginok");
    EventBus.off("deleteok");
  },
};
</script>

<!-- Importing the external CSS file -->
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

/* ------------------------------------------ nav-menu ------------------------------------------*/

.navmain {
  height: 100px;
  background-size: cover;
  background-position: center;
  background: linear-gradient(45deg, #8e68d3, #8837d4, #d63a3a);
}

nav {
  align-items: center; /* จัดแนวไอเท็มในแนวตั้ง */
  justify-content: space-between; /* เว้นระยะห่างระหว่างกลุ่ม */
  display: flex;
  padding: 10px 20px; /* เพิ่มพื้นที่ภายในของ nav */
  padding: 2rem;
  margin: 0 2rem;
}

.login-logo img {
  height: 50px; /* กำหนดความสูงของโลโก้ */
}

.main-menu,
.mangemert,
.account-menu {
  display: flex; /* ใช้ flexbox เพื่อจัดเรียงไอเท็มในแนวนอน */
  list-style-type: none; /* ไม่ให้มีจุดหน้าหรือเลขหน้า */
  margin: 0; /* ไม่มี margin */
  padding: 0; /* ไม่มี padding */
}

.main-menu li,
.mangemert li,
.account-menu li {
  margin: 0 8px; /* เว้นระยะห่างระหว่างไอเท็ม */
}

.nav-link:hover {
  text-decoration: none; /* ไม่ให้มีเส้นใต้ */
   /* กำหนดสีของข้อความ */
  font-weight: 500; /* กำหนดความหนาของตัวอักษร */
  transition: color 0.3s; /* เพิ่มเอฟเฟกต์การเปลี่ยนสี */
}

.account-menu li {
  margin-left: 20px; /* เว้นระยะห่างจากเมนูหลัก */
}

nav .nav-link {
  color: #ffff;
}
</style>
