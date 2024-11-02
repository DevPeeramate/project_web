<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-logo">
        <img src="../assets/image/logo.png" alt="Logo" />
        <h2>Travel</h2>
        <p>สมัครสมาชิก</p>
      </div>
      <form @submit.prevent="handleSubmit()">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            autocomplete="off"
            required v-model.trim="username"
            placeholder="Enter your username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            autocomplete="off"
            required
            v-model.trim="password"
            placeholder="Enter your password"
          />
        </div>
         <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            class="form-control"
            id="memName"
            autocomplete="off"
            required v-model.trim="memName"
            placeholder="Enter your name"
          />
        </div>
         <div class="form-group">
          <label for="gender">Gender</label>
          <input
            type="text"
            class="form-control"
            id="gender"
            autocomplete="off"
            required v-model.trim="gender"
            placeholder="Enter your gender"
          />
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            autocomplete="off"
            v-model.trim="email"
            placeholder="Enter your email"
          />
        </div>
         <div class="form-group">
          <label for="phone">Phone number</label>
          <input
            type="text"
            class="form-control"
            id="phone"
            autocomplete="off"
            required v-model.trim="phone"
            placeholder="Enter your phone number"
          />
        </div>
        <button class="btn btn-primary float-end" type="submit" >
                            <i class="bi bi-check-lg"></i>&nbsp;สมัครสมาชิก</button>
        <div class="login-link">
          มีบัญชีอยู่แล้วใช่ไหม <a href="/login">เข้าสู่ระบบ</a>
        </div>
      </form>
      <p v-if="backendMessage=='success'" class="alert alert-success mt-3">
                ลงทะเบียนสำเร็จ {{ backendMessage }}</p>
            <p v-else-if="backendMessage=='fail'" class="alert alert-danger mt-3">
                Username has been used {{ backendMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      username: null,
      memName: null,
      password: null,
      gender: null,
      email: null,
      phone: null,
      backendMessage: null,
    };
  },
  methods: {
    async handleSubmit() {
      let members = {
        username: this.username,
        gender: this.gender,
        email: this.email,
        phone: this.phone,
        memName: this.memName,
        password: this.password,
      };
      try {
        const response = await axios.post(`http://localhost:3000/register`, members);
        this.backendMessage = response.data.messageRegister;
        if(this.backendMessage == "success"){
          window.alert("Register Success");
          this.$router.push('/login')
        }else{
          window.alert("Failed to register. Username has been used")
        }
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

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.register-card {
  background-color: #f2f6fc;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.register-logo img {
  width: 60px;
  margin-bottom: 10px;
}

.register-logo h2 {
  margin: 10px 0;
  color: #2c3e50;
  font-weight: 600;
}

.register-logo p {
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

.login-link {
  margin-top: 20px;
  font-size: 14px;
}

.login-link a {
  color: #3498db;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>