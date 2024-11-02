<template>
  <div class="manage-room-page">
    <h1 class="page-title">Manage Room</h1>
    <p class="page-description">This is the room management page.</p>

    <div class="container">
      <div class="search-bar d-flex justify-content-end mb-4">
        <input v-model="stext" type="text" class="search-input" placeholder="Search..." />

        <button class="btn btn-primary search-btn me-2" @click="searchRoom()">
          ค้นหา
        </button>

        <router-link to="/AddRoom" style="text-decoration: none">
          <button class="btn btn-success add-room-btn">Add Room</button>
        </router-link>

        <router-link to="/AdminHome" style="text-decoration: none">
          <button class="btn btn-menu">Menu</button>
        </router-link>

      </div>

      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>เลขห้อง</th>
            <th>สถานะห้อง</th>
            <th>ชั้น</th>
            <th>ชื่อห้อง</th>
            <th>ขนาดห้อง</th>
            <th>รายละเอียดห้อง</th>
            <th>ราคาห้อง</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in rooms" :key="room.id">
            <td>{{ index + 1 }}</td>
            <td>{{ room.roomId }}</td>
            <td>{{ room.roomStatus }}</td>
            <td>{{ room.floor }}</td>
            <td>{{ room.roomName }}</td>
            <td>{{ room.roomSize }}</td>
            <td>{{ room.roomDetail }}</td>
            <td>{{ room.roomPrice }}</td>
            <td>
              <button class="btn btn-warning btn-sm" @click="editRoom(room)">
                แก้ไข
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import EditRoom from "./EditRoom.vue";
axios.defaults.withCredentials = true;
export default {
  name: "ManageRoom",
  // components:{EditRoom},
  data() {
    return {
      rooms: [],
      stext: "",
      backendMessage: null,
      username: null,
      role: null,
      memName: null,
      // role: null,
    };
  },
  mounted() {
    this.fetchRooms();
    this.checkRole(); // ดึงข้อมูลเมื่อคอมโพเนนต์ถูกโหลด
  },
  methods: {
    async checkRole() {
      try {
        await axios.get(`http://localhost:3000/session`).then((res) => {
          this.username = res.data.username;
          this.memName = res.data.name;
          this.role = res.data.role;
        });
        if (this.role !== "admin") {
          console.log(this.role);
          this.$router.push("/admin"); // ถ้าไม่ใช่ admin ให้ redirect ไปหน้าแรก
        }
      } catch (err) {
        console.log(err);
      }
    },
    fetchRooms() {
      axios
        .get("http://localhost:3000/admin/AllRoom") // เปลี่ยน URL ให้ตรงกับ Backend ของคุณ
        .then((res) => {
          this.rooms = res.data;
        })
        .catch((error) => {
          console.error("Error!", error);
        });
    },
    searchRoom() {
      axios
        .get(`http://localhost:3000/admin/searchRoom/${this.stext}`)
        .then((res) => {
          console.log(this.stext);
          this.rooms = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    editRoom(roomId) {
      // const testData = 12345
      console.log(roomId);
      this.$router.push({
        name: "EditRoom",
        params: { dataTest: roomId.roomId },
      });
      // this.$router.push({ name: 'EditRoom', params: {data: JSON.stringify(roomId)} });
    },
  },
};
</script>

<style scoped>
.manage-room-page {
  padding: 50px;
  background-color: #f9fafc;
  width: 100%;
  border-collapse: separate;
  border-radius: 15px;
  overflow: hidden; /* เพื่อให้ขอบมลมีผล */
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1); /* เงาแบบ soft shadow */
  margin-top: 20px;
}

.page-title {
  font-size: 2.5rem;
  color: #343a40;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.page-description {
  font-size: 1.1rem;
  color: #6c757d;
  text-align: center;
  margin-bottom: 20px;
}

/* ------------------------------------------ search ------------------------------------------*/
/* From Uiverse.io by mRcOol7 */ 
.search-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #5c5c5c, #f5f5f5);
  padding: 30px;
  border-radius: 15px;
  transition: background 0.3s ease;
  perspective: 1000px;
}

.label {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
  transition: transform 0.3s ease, font-size 0.3s ease, color 0.3s ease,
    text-shadow 0.3s ease;
}

.search-input {
  position: relative;
  width: 230px;
  height: 40px;
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background: linear-gradient(to right, #d9d9d9, #f8f8f8);
  font-size: 16px;
  color: #555;
  outline: none;
  transition: box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease,
    border-color 0.3s ease, transform 0.3s ease;
  transform-style: preserve-3d;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.2) inset; /* Improved box-shadow for a realistic feel */
}

.search-input:focus,
.search-input:not(:placeholder-shown) {
  border-color: #614caf;
  background: linear-gradient(to right, #cac2f0, #f0f0f0);
  transform: rotateX(20deg);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.2) inset; /* Improved box-shadow on focus */
}

.search-input:focus + .label,
.search-input:not(:placeholder-shown) + .label {
  transform: translateY(-120%) scale(0.8);
  font-size: 12px;
  color: #614caf;
  text-shadow: 0 0 5px rgba(111, 76, 175, 0.6);
}

.search-input:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.2) inset; /* Improved box-shadow on hover */
  background: linear-gradient(to right, #e6e6e6, #f9f9f9);
  border-color: #999;
}

.clear-button {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease, color 0.3s ease;
}

.clear-button:hover {
  color: #614caf;
  transform: scale(1.1);
}

.search-input:not(:focus):not(:placeholder-shown) + .clear-button {
  opacity: 1;
}

.shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.search-input:focus + .shine {
  opacity: 1;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease, filter 0.3s ease;
  border-radius: 50%;
}

.search-input:focus + .search-icon {
  color: #614caf;
  transform: translateY(-50%) scale(1.1);
  filter: drop-shadow(0 0 5px rgba(106, 76, 175, 0.6));
}

@keyframes inputPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
/* ------------------------------------------ btn-common ------------------------------------------*/
.search-input:focus {
  animation: inputPulse 0.5s ease;
}

.search-input {
  width: 500%;
  max-width: 500px;
}

.btn-menu,
.search-btn,
.add-room-btn {
  border: none;
  padding: 8px 20px; /* เพิ่ม padding ให้อยู่ในระดับที่ใกล้เคียงกัน */
  width: 150px; /* ปรับขนาดให้เท่ากัน */
  color: white; /* เพิ่มสีตัวอักษรให้เท่ากัน */
  box-sizing: border-box; /* รวม padding และ border ในการคำนวณขนาด */
  margin: 5px; /* เพิ่มระยะห่างระหว่างปุ่ม */
  margin-top: 1px;
}

.search-btn {
  background: linear-gradient(45deg, #68cfd3, #3776d4, #3a44d6);
}

.add-room-btn {
  background: linear-gradient(45deg, #68d368, #37d459, #acd63a);
}

.btn-menu {
  background: linear-gradient(45deg, #d368b8, #a237d4, #3d3ad6);
}

.table {
  margin-top: 20px;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.table-dark {
  background-color: #343a40;
  color: white;
}

.btn-warning {
  background-color: #c91f1f;
  color: white;
}

.btn-warning:hover {
  background-color: #944f4f;
}
</style>