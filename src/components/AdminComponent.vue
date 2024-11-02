<template>
  <div v-if="isAuthorized" class="admin-container">
    <!-- <h2 class="admin-title">Admin Dashboard</h2>
    <div class="admin-actions">
      <div class="action-card" @click="navigateTo('manage-products')">
        <h3>Manage Products</h3>
      </div>
      <div class="action-card" @click="navigateTo('manage-orders')">
        <h3>Manage Orders</h3>
      </div>
      <div class="action-card" @click="navigateTo('manage-users')">
        <h3>Manage Users</h3>
      </div>
    </div> -->
  </div>

  <!-- กรณีที่ไม่ได้รับอนุญาต -->
  <div v-else class="unauthorized">
    <h2>Access Denied</h2>
    <p>You are not authorized to access this page.</p>
  </div>
</template>
    
    <script>
export default {
  data() {
    return {
      // isAuthorized: false, // ตรวจสอบการอนุญาต
    };
  },
  mounted() {
    // console.log(sessionStorage.getItem("role"));
    // this.checkAuthorization(); // ตรวจสอบการอนุญาตเมื่อโหลดหน้า
  },
  methods: {
    // checkAuthorization() {
    //   const token = localStorage.getItem("token"); // รับ JWT token
    //   if (token) {
    //     const payload = this.decodeToken(token); // แยกส่วน payload ของ JWT
    //     if (payload && payload.role === "admin") {
    //       this.isAuthorized = true; // ถ้า role เป็น admin
    //     } else {
    //       this.isAuthorized = false;
    //     }
    //   } else {
    //     this.isAuthorized = false;
    //   }
    // },
    // decodeToken(token) {
    //   // ใช้ฟังก์ชัน decode JWT token (คุณสามารถใช้ library เช่น jwt-decode)
    //   try {
    //     return JSON.parse(atob(token.split(".")[1])); // แปลง JWT token ส่วน payload
    //   } catch (error) {
    //     console.error("Token decoding failed:", error);
    //     return null;
    //   }
    // },
    // navigateTo(page) {
    //   if (this.isAuthorized) {
    //     this.$router.push({ name: page });
    //   }
    // },
  },
};
</script>
    
    <style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.unauthorized {
  text-align: center;
  padding: 40px;
}

.admin-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 40px;
  color: #2c3e50;
}

.admin-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.action-card {
  background-color: #3498db;
  color: white;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-card:hover {
  background-color: #2980b9;
}

.unauthorized h2 {
  color: red;
}

.unauthorized p {
  color: gray;
}
</style>
    