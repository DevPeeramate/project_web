<template>
  <div class="adminhome">
    <div class="title-con">
      <h1>Admin Home</h1>
      <p>This is the Admin Home page.</p>

      <div class="btn-con">
        <router-link to="/ManageRoom" style="text-decoration: none">
          <button class="btn btn-primary">Manage Rooms</button>
        </router-link>
        <router-link to="/ManageReview" style="text-decoration: none">
          <button class="btn btn-primary">Manage Reviews</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {};
</script>
 
<style>
.adminhome {
  max-width: 1200px;
  margin: 8rem auto;
  padding: 45px 50px;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.title-con h1 {
  color: black;
  text-align: center;
}

.title-con p {
  text-align: center;
}

.btn-con {
  display: flex;
  justify-content: center; /* จัดให้อยู่ตรงกลาง */
  gap: 10px; /* ระยะห่างระหว่างปุ่ม */
  margin-top: 20px; /* เพิ่มระยะห่างด้านบนถ้าต้องการ */
}

.cus-btn {
  width: 160px; /* ปรับขนาดความกว้าง */
}
</style>