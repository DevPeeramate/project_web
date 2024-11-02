<template>
  <div class="container-detail">
    <div v-for="room in rooms" :key="room.id" class="mt-2">
      <div class="date-inputs">
        <label for="checkInDate">Check-In Date:</label>
        <input type="date" id="checkInDate" v-model="checkInDate" @change="validateDates" />

        <label for="checkOutDate">Check-Out Date:</label>
        <input type="date" id="checkOutDate" v-model="checkOutDate" @change="validateDates" />
      </div>

      <div class="row">
        <div class="room">
          <div class="card mx-auto" style="width: 20rem">
            <img
              :src="`http://localhost:3000/img_room/${room.roomId}_${room.roomName}.jpg`"
              alt="Room Image"
              class="img-fluid"
            />
            <!-- แสดงจำนวนวันและราคารวมใต้รูป -->
            <div class="p-3">
              <h5 v-if="dayCount>=0">วันที่พัก : {{ dayCount }} วัน</h5>
              <h5 v-else>วันที่พัก : จองห้องในระบบไม่ได้ กรุณาเลือกวันใหม่</h5>
              <h5>ราคารวม : {{ totalPrice }}</h5>
            </div>
          </div>
        </div>
        
        <div class="room">
          <table class="table">
            <tbody>
              <tr class="table-secondary">
                <td><h4>Room : {{ room.roomId }}</h4></td>
                <td><h4>Room Name : {{ room.roomName }}</h4></td>
              </tr>
              <tr>
                <td><h5>ราคา</h5></td>
                <td><h5>{{ room.roomPrice }}</h5></td>
              </tr>
              <tr>
                <td><h5>ชั้น</h5></td>
                <td><h5>{{ room.floor }}</h5></td>
              </tr>
              <tr>
                <td><h5>ขนาด</h5></td>
                <td><h5>{{ room.roomSize }}</h5></td>
              </tr>
              <tr>
                <td><h5>รายละเอียด</h5></td>
                <td><h5>{{ room.roomDetail }}</h5></td>
              </tr>
            </tbody>
          </table>

          <!-- ปุ่ม Book Now และ Clear Dates -->
          <button :disabled="!isBookingEnabled" class="btn-book" @click="chkLogin()">Book Now</button>
          <button class="btn" @click="clearDates" style="width: 100px">
            <i class="animation"></i>ClearDate<i class="animation"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  name: "RoomDetail",
  data() {
    return {
      username: null,
      checkInDate: null,
      checkOutDate: null,
      isBookingEnabled: false,
      roomId: null,
      rooms: [],
      totalPrice: null,
      dayCount: 0, // ฟิลด์สำหรับเก็บจำนวนวันพัก
    };
  },
  mounted() {
    this.roomId = this.$route.params.roomId;
    this.fetchRooms();
  },
  methods: {
    validateDates() {
      if (this.checkInDate && this.checkOutDate) {
        this.isBookingEnabled = true;
        this.calculateTotalPrice();
      } else {
        this.isBookingEnabled = false;
        this.totalPrice = null;
        this.dayCount = 0; // รีเซ็ตจำนวนวันพักเมื่อวันที่ไม่ครบ
      }
    },
    calculateTotalPrice() {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);
      const timeDiff = checkOut - checkIn;
      this.dayCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (this.dayCount > 0) {
        this.totalPrice = this.dayCount * this.rooms[0].roomPrice;
      } else {
        // this.dayCount = 0;
        this.totalPrice = 0;
      }
    },
    fetchRooms() {
      axios
        .get(`http://localhost:3000/admin/room/${this.roomId}`)
        .then((res) => {
          this.rooms = res.data;
        })
        .catch((error) => {
          console.error("Error!", error);
        });
    },
    async chkLogin() {
      await this.chkSession();
      if (this.username == null) {
        alert("ต้อง Login เข้าระบบก่อน");
        return false;
      } else {
        await this.bookRoom();
      }
    },
    async bookRoom() {
      try {
        const data = {
          totalPrice : this.totalPrice,
          totalDay : this.dayCount,
          roomId: this.roomId,
          username: this.username,
          checkInDate: this.checkInDate,
          checkOutDate: this.checkOutDate,
        };

        await axios.post(`http://localhost:3000/reservation`, data).then((res) => {
          if (res.data.messageAddReservation == "success") {
            alert("จองห้องสำเร็จ");
            this.$router.push("/myroom");
          } else {
            alert("จองห้องไม่สำเร็จ");
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    async chkSession() {
      await axios
        .get(`http://localhost:3000/session`)
        .then((res) => {
          this.username = res.data.username;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    clearDates() {
      this.checkInDate = null;
      this.checkOutDate = null;
      this.isBookingEnabled = false;
      this.totalPrice = null;
      this.dayCount = 0; // รีเซ็ตจำนวนวันพักเมื่อกดปุ่ม Clear
    },
  },
};
</script>

<style scoped>
.container-detail {
  max-width: 1200px;
  margin: 8rem auto;
  padding: 45px 50px;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* ------------------------------------------ date ------------------------------------------*/
.date-inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}

.date-inputs label {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.date-inputs input[type="date"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  color: #333;
  outline: none;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.date-inputs input[type="date"]:focus {
  border-color: #3498db; /* สีเมื่อโฟกัส */
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5); /* เงาเมื่อโฟกัส */
}

.date-inputs input[type="date"]::placeholder {
  color: #aaa; /* สีตัวอักษร placeholder */
}

.date-inputs input[type="date"]:hover {
  border-color: #2980b9; /* สีเมื่อ hover */
}

/* ------------------------------------------ img-room ------------------------------------------*/

.row {
  display: flex;
  align-items: flex-start; /* จัดให้อยู่ในแนวเดียวกันด้านบน */
  gap: 20px; /* เว้นช่องว่างระหว่าง room กับ table */
  flex-wrap: wrap; /* ถ้าพื้นที่ไม่พอ จะให้แถวใหม่ */
}

.room {
  flex: 1;
  min-width: 300px; /* ความกว้างขั้นต่ำของแต่ละคอลัมน์ */
  max-width: 50%; /* จำกัดความกว้างของแต่ละคอลัมน์ */
}

.card {
  margin-top: 2rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15); /* เงาแบบ soft shadow */
  transition: transform 0.3s ease; /* เอฟเฟ็กต์เมื่อ hover */
}

.card:hover {
  transform: scale(1.05); /* ขยายเมื่อ hover */
}

.card img {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.card .p-3 {
  padding: 20px;
}

.table {
  width: 100%; /* ขยายเต็มที่ตาม room */
  border-collapse: separate;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
}

/* ------------------------------------------ btn ------------------------------------------*/

.btn-book {
  background: linear-gradient(45deg, #f89a1f, #f3074e, #ec1e1e);
  border-radius: 50px;
  color: white;
  padding: 10px 25px;
  border: none;
}

.btn {
  margin-left:10rem;
  outline: 0;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  background: #40B3A2;
  min-width: 200px;
  border: 0;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.199);
  box-sizing: border-box;
  padding: 16px 20px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  overflow: hidden;
  cursor: pointer;
}

.btn:hover {
  opacity: .95;
}

.btn .animation {
  border-radius: 100%;
  animation: ripple 0.6s linear infinite;
}

@keyframes ripple {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1), 0 0 0 20px rgba(255, 255, 255, 0.1), 0 0 0 40px rgba(255, 255, 255, 0.1), 0 0 0 60px rgba(255, 255, 255, 0.1);
  }

  100% {
    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0.1), 0 0 0 40px rgba(255, 255, 255, 0.1), 0 0 0 60px rgba(255, 255, 255, 0.1), 0 0 0 80px rgba(255, 255, 255, 0);
  }
}

/* ------------------------------------------ img-room ------------------------------------------*/
.table {
  width: 100%;
  border-collapse: separate;
  border-radius: 15px;
  overflow: hidden; /* เพื่อให้ขอบมลมีผล */
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1); /* เงาแบบ soft shadow */
  margin-top: 20px;
}

.table td, .table th {
  padding: 15px;
  border-bottom: 1px solid #ddd; /* เส้นขอบแถว */
}

.table-secondary {
  background-color: #f8f9fa;
  font-weight: bold;
  text-align: left;
}

.table-secondary td {
  font-size: 1.1rem;
  color: #333;
}

.table td {
  font-size: 1rem;
  color: #555;
}

.table tbody tr:hover {
  background-color: #f1f1f1; /* เปลี่ยนสีเมื่อ hover */
}

h4, h5 {
  margin: 0;
}

</style>
