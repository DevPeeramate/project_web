<template>
  <div class="myroom-container">
  <h1>HISTORY BOOKING</h1>
    <div v-if="reservations.length === 0" >
      <p class="no-room-message">No Room</p>
    </div>
    <div
      v-for="room in reservations"
      :key="room.id"
      class="card mb-3"
      style="max-width: 540px"
    >
      <div class="row g-0">
        <div class="col-md-4">
          <img
            :src="`http://localhost:3000/img_room/${room.roomId}_${room
        .roomName}.jpg`"
            class="img-fluid rounded-start"
            alt="Room Image"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ room.roomName }}</h5>
            <p class="card-text">
              <strong>BookID:</strong> {{ room.bookId }}<br />
              <strong>CheckIn:</strong> {{ formattedDate(room.checkInDate)
              }}<br />
              <strong>CheckOut:</strong> {{ formattedDate(room.checkOutDate)
              }}<br />
              <strong>เลขห้อง:</strong> {{ room.roomId }}<br />
              <strong>ชั้น:</strong> {{ room.floor }}<br />
              <strong>ขนาดห้อง:</strong> {{ room.roomSize }}<br />
              <strong>ราคาห้อง:</strong> {{ room.totalPrice }}
            </p>
            <div class="button-container d-flex justify-content-between my-3">
              <button @click="deleteReservation(room.bookId)" class="btn btn-danger" style="width: 100px">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import EditRoom from "./EditRoom.vue";
axios.defaults.withCredentials = true;
export default {
  name: "MyRoom",

  data() {
    return {
      username: null,
      reservations: [],
      // rooms: [],
    };
  },
  mounted() {
    this.chkSession();
    // this.fetchRooms();
  },
  methods: {
    fetchReservations() {
      console.log(this.username);
      axios
        .get(`http://localhost:3000/reservation/${this.username}`)
        .then((response) => {
          this.reservations = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // fetchRooms() {
    //   axios
    //     .get("http://localhost:3000/admin/AllRoom") // เปลี่ยน URL ให้ตรงกับ Backend ของคุณ
    //     .then((res) => {
    //       this.rooms = res.data;
    //     })
    //     .catch((error) => {
    //       console.error("Error!", error);
    //     });
    // },
    async chkSession() {
      try {
        await axios.get(`http://localhost:3000/session`).then((res) => {
          this.username = res.data.username;
          if (this.username) {
            this.fetchReservations();
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    formattedDate(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มต้นที่ 0, จึงต้อง +1
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    deleteReservation(id) {
      console.log(id);
      if (confirm("คุณต้องการยกเลิกการจองนี้หรือไม่?")) {
       
        axios
          .delete(`http://localhost:3000/reservation/${id}`) // ลบข้อมูลการจองที่มี ID ตรงกัน
          .then(() => {
            alert("ยกเลิกการจองสำเร็จ");
             this.reservations = this.reservations.filter(room => room.bookId !== id);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>

<style>
.myroom-container {
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(45deg, #cbafff, #917aff, #7de1ff); /* สีพื้นหลังตามที่คุณกำหนด */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  color: #333;
}

h1 {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.card {
  background-color: #ffffff;
  border: none;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  margin-bottom: 20px;
}

.card:hover {
  transform: translateY(-5px); /* เพิ่มเอฟเฟกต์เลื่อนขึ้นเล็กน้อยเมื่อชี้เมาส์ */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15); /* เพิ่มเงาเมื่อ hover */
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #6a0dad;
}

.card-text {
  color: #333;
  font-size: 1rem;
}

.no-room-message {
  text-align: center;
  color: red;
  font-size: 2rem;
  font-weight: bold;
  margin-top: 50px;
}

.button-container .btn-danger {
  background: linear-gradient(45deg, #ff6b6b, #ff4e50); /* สีแดงไล่เฉด */
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  transition: background-color 0.3s ease, transform 0.2s;
}

.button-container .btn-danger:hover {
  background: linear-gradient(45deg, #ff4e50, #ff6b6b); /* เปลี่ยนเฉดเมื่อ hover */
  transform: scale(1.05); /* ขยายปุ่มเล็กน้อยเมื่อ hover */
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.img-fluid {
  border-radius: 10px 0 0 10px;
  max-height: 150px;
  object-fit: cover;
}

</style>
