<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-logo">
        <img src="../assets/image/logo.png" alt="Logo" />
        <h2>Travel</h2>
        <p>เข้าสู่ระบบ</p>
      </div>
      <form @submit.prevent="handleSubmit()">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="loginname"
            v-model="loginName"
            required
            autofocus
            placeholder="Enter your username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <!-- <div class="form-options">
          <label class="checkbox">
            <input type="checkbox" v-model="rememberMe" /> จดจำรหัสผ่าน
          </label>
          <a href="#" class="forgot-password">ลืมรหัสผ่าน</a>
        </div> -->
        <button type="submit" class="btn">เข้าสู่ระบบ</button>
        <div class="register-link">
          ยินดีต้อนรับทุกท่าน
          <router-link to="/register">สร้างบัญชีใหม่</router-link>
        </div>
      </form>
      <p v-if="backendMessage == 'success'" class="alert alert-success">
        เข้าสู่ระบบสำเร็จ - {{ backendMessage }}
      </p>
      <p v-else-if="backendMessage == 'fail'" class="alert alert-danger">
        Username หรือ Password ไม่ถูกต้อง - {{ backendMessage }}
      </p>
    </div>
  </div>
</template>
 
<script>
import { EventBus } from "@/event-bus";
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  components: {},
  data() {
    return {
      loginName: null,
      password: null,
      backendMessage: null,
      username: null,
      memName: null,
      role: null,
    };
  },
  mounted() {
    if (sessionStorage.getItem("memName") != null) this.$router.push("/");
  },
  methods: {
    async handleSubmit() {
      try {
        let members = {
          loginName: this.loginName,
          password: this.password,
        };
        const response = await axios.post(
          `http://localhost:3000/login`,
          members
        );
        this.backendMessage = response.data.messageLogin;
        console.log(this.backendMessage);
        await this.chkSession();
        if (this.backendMessage == "success") {
          if (this.role === "admin") {
            EventBus.emit("loginok");
            this.$router.push("/AdminHome");
          } else if (this.role === "member") {
            EventBus.emit("loginok");
            this.$router.push("/");
          }
          // console.log(this.backendMessage);
          // EventBus.emit("loginok");
          // this.$router.push("/ManageRoom");
          // this.$router.push("/admin");
        } else {
          console.log("login error");
        }
      } catch (err) {
        console.log(err);
      }
    },
 
    async chkSession() {
      try {
        await axios.get(`http://localhost:3000/session`).then((res) => {
          this.username = res.data.username;
          this.memName = res.data.name;
          this.role = res.data.role;
          sessionStorage.setItem("memName", res.data.name);
          sessionStorage.setItem("role", res.data.role);
          // if (res.data.role === "member") {
          //   sessionStorage.removeItem("role");
          // } else {
          //   this.role = res.data.role;
          // }
        });
      } catch (err) {
        console.log(err);
      }
    },
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
  font-family: "Roboto", sans-serif;
  background-color: #eef2f7;
}
 
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
 
.login-card {
  background-color: #f2f6fc;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  text-align: center;
}
 
.login-logo img {
  width: 60px;
  margin-bottom: 10px;
}
 
.login-logo h2 {
  margin: 10px 0;
  color: #2c3e50;
  font-weight: 600;
}
 
.login-logo p {
  color: #95a5a6;
  font-size: 14px;
}
 
.form-group {
  margin-bottom: 15px;
  text-align: left;
}
 
.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #2c3e50;
}
 
.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #f7f9fc;
}
 
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}
 
.checkbox input {
  margin-right: 8px;
}
 
.forgot-password {
  color: #3498db;
  text-decoration: none;
}
 
.forgot-password:hover {
  text-decoration: underline;
}
 
.btn {
  width: 100%;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
 
.btn:hover {
  background-color: #2980b9;
}
 
.register-link {
  margin-top: 20px;
  font-size: 14px;
}
 
.register-link a {
  color: #3498db;
  text-decoration: none;
}
 
.register-link a:hover {
  text-decoration: underline;
}
</style>