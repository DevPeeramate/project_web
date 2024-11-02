<template>
  <div class="room-container">
    <h2 class="room-title">Find Your Perfect Room</h2>

    <!-- ส่วนของฟิลเตอร์การค้นหา -->
    <div class="search-bar">
      <label for="selection">Name Room :</label>
      <select v-model="selectNameRoom" id="selection">
        <option
          v-for="option in optionNameRoom"
          :key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
      <label for="selection">Floor :</label>
      <select v-model="selectFloor" id="selection">
        <option
          v-for="option in optionFloor"
          :key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
      <label for="selection">Guests :</label>
      <select v-model="selectSize" id="selection">
        <option
          v-for="option in optionGuest"
          :key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>

      <!-- <button class="btn-clear" @click="clear">Clear</button> -->
      <button class="button" @click="clear">
        Clear
        <div class="hoverEffect">
          <div></div>
        </div>
      </button>

      <!-- <button class="btn-filter" @click="filterRooms">Search</button> -->
      <button type="button" class="btn" @click="filterRooms">
        <strong>SEARCH</strong>
        <div id="container-stars">
          <div id="stars"></div>
        </div>

        <div id="glow">
          <div class="circle"></div>
          <div class="circle"></div>
        </div>
      </button>

    </div>

    <!-- ส่วนของแสดงห้องพัก -->
    <div class="room-list">
      <div class="room-card" v-for="room in rooms" :key="room.id">
        <img
          :src="`http://localhost:3000/img_room/${room.roomId}_${room.roomName}.jpg`"
          alt="Room Image"
          class="room-image"
        />
        <div class="room-info">
          <h3>Room : {{ room.roomId }}</h3>
          <p class="room-name">{{ room.roomName }}</p>
          <p class="room-price">{{ room.roomPrice }} BATH / night</p>

          <button class="btn-book" @click="roomDetail(room)">Book Now</button>
        </div>
      </div>
    </div>

    <!-- ฟอร์มการจอง -->
    <!-- <div v-if="selectedRoom" class="booking-form">
      <h3>Booking for {{ selectedRoom.name }}</h3>
      <form @submit.prevent="submitBooking">
        <div class="form-group">
          <label for="fullName">Full Name:</label>
          <input
            type="text"
            v-model="booking.fullName"
            id="fullName"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="booking.email" id="email" required />
        </div>

        <div class="form-group">
          <label for="phone">Phone Number:</label>
          <input type="tel" v-model="booking.phone" id="phone" required />
        </div>

        <div class="form-group">
          <label for="checkinDate">Check-in Date:</label>
          <input
            type="date"
            v-model="booking.checkinDate"
            id="checkinDate"
            required
          />
        </div>

        <div class="form-group">
          <label for="checkoutDate">Check-out Date:</label>
          <input
            type="date"
            v-model="booking.checkoutDate"
            id="checkoutDate"
            required
          />
        </div>

        <button type="submit" class="btn-submit">Confirm Booking</button>
      </form>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
// import EditRoom from "./EditRoom.vue";
axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      rooms: [],
      // filters: {
      //   checkin: "",
      //   checkout: "",
      //   guests: 1,
      // },
      selectNameRoom: null, // เก็บค่าที่เลือกจาก dropdown
      selectSize: null,
      selectFloor: null,
      optionNameRoom: [
        // ตัวเลือกใน dropdown
        { value: null, text: "All" },
        { value: "Standard Room", text: "Standard Room" },
        { value: "Luxury Roo", text: "Luxury Room" },
        { value: "Suite Room", text: "Suite Room" },
      ],
      optionFloor: [
        // ตัวเลือกใน dropdown
        { value: null, text: "All" },
        { value: "1", text: "1" },
        { value: "2", text: "2" },
        { value: "3", text: "3" },
      ],
      optionGuest: [
        // ตัวเลือกใน dropdown
        { value: null, text: "All" },
        { value: "1", text: "1" },
        { value: "2", text: "2" },
        { value: "3", text: "3" },
        { value: "4", text: "4" },
      ],
      //   filteredRooms: [],
      //   selectedRoom: null,
      //   booking: {
      //     fullName: "",
      //     email: "",
      //     phone: "",
      //     checkinDate: "",
      //     checkoutDate: "",
      //   },
    };
  },
  mounted() {
    this.fetchRooms();
    // this.filteredRooms = this.rooms;
  },
  methods: {
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
    roomDetail(roomId) {
      // const testData = 12345
      console.log(roomId);
      this.$router.push({
        name: "roomdetail",
        params: { roomId: roomId.roomId },
      });
      // this.$router.push({ name: 'EditRoom', params: {data: JSON.stringify(roomId)} });
    },
    async filterRooms() {
      let rooms = {
        roomName: this.selectNameRoom,
        roomSize: this.selectSize,
        floor: this.selectFloor,
      };
      console.log(rooms);
      await axios
        .post(`http://localhost:3000/rooms/`, rooms)
        .then((res) => {
          this.rooms = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // bookRoom(room) {
    //   this.selectedRoom = room;
    //   this.booking.checkinDate = this.filters.checkin;
    //   this.booking.checkoutDate = this.filters.checkout;
    // },
    // submitBooking() {
    //   alert(
    //     `Booking confirmed for ${this.booking.fullName} in ${this.selectedRoom.name}`
    //   );
    //   this.selectedRoom = null;
    // },
    clear() {
      this.selectNameRoom = null;
      this.selectSize = null;
      this.selectFloor = null;
    },
  },
};
</script>

<style scoped>
/* ------------------------------------------ drop=dow ------------------------------------------*/
select {
  padding: 8px;
  border: 1px solid #bbcafd;
  border-radius: 8px;
  font-size: 16px;
  color: #0d4fdf;
  background-color: #fcfcfc; /* สีพื้นหลังปกติ */
  cursor: pointer;
}

select:focus {
  border-color: #d7e2ff;
  outline: none;
  background-color: #f2f7fd; /* สีพื้นหลังเมื่อโฟกัส */
}

/* จัดการ container หลัก */
.room-container {
  padding: 20px;
  padding: 20px;
  border-radius: 30px;
  background: linear-gradient(45deg, #cbafff, #917aff, #7de1ff);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.room-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 40px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* ส่วนของฟิลเตอร์ */
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

/* .filter-group {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
} */

.dropdown-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px; /* ช่องว่างระหว่าง label กับ dropdown */
}

label {
  font-weight: bold;
  font-size: 16px;
}

/* ------------------------------------------ ส่วนของรายการห้องพัก ------------------------------------------*/
.room-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.room-card {
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.room-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.room-image {
  width: 100%;
  border-radius: 15px;
  margin-bottom: 15px;
}

.room-info {
  text-align: center;
}

.room-info h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
}

.room-description {
  color: #7f8c8d;
  margin-bottom: 15px;
}

.room-price {
  margin: 10px 0;
  font-size: 1.3rem;
  font-weight: bold;
  color: #624f86;
}

/* ------------------------------------------ btn-clear ------------------------------------------*/
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 30px;
  border: 0;
  position: relative;
  overflow: hidden;
  border-radius: 10rem;
  transition: all 0.02s;
  font-weight: bold;
  cursor: pointer;
  color: rgb(37, 37, 37);
  z-index: 0;
  box-shadow: 0 0px 7px -5px rgba(0, 0, 0, 0.5);
}

.button:hover {
  background: rgb(193, 228, 248);
  color: rgb(33, 0, 85);
}

.button:active {
  transform: scale(0.97);
}

.hoverEffect {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.hoverEffect div {
  background: rgb(222, 0, 75);
  background: linear-gradient(
    90deg,
    rgba(222, 0, 75, 1) 0%,
    rgba(191, 70, 255, 1) 49%,
    rgba(0, 212, 255, 1) 100%
  );
  border-radius: 40rem;
  width: 10rem;
  height: 10rem;
  transition: 0.4s;
  filter: blur(20px);
  animation: effect infinite 3s linear;
  opacity: 0.5;
}

.button:hover .hoverEffect div {
  width: 8rem;
  height: 8rem;
}

@keyframes effect {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* ------------------------------------------ btn-search ------------------------------------------*/

/* From Uiverse.io by StealthWorm */ 
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 13rem;
  overflow: hidden;
  height: 3rem;
  background-size: 300% 300%;
  cursor: pointer;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;
  background-image: linear-gradient(#212121, #212121),
    linear-gradient(
      137.48deg,
      #ffdb3b 10%,
      #fe53bb 45%,
      #8f51ea 67%,
      #0044ff 87%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
}

#container-stars {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
}

strong {
  z-index: 2;
  font-family: "Avalors Personal Use";
  font-size: 12px;
  letter-spacing: 5px;
  color: #ffffff;
  text-shadow: 0 0 4px white;
}

#glow {
  position: absolute;
  display: flex;
  width: 12rem;
}

.circle {
  width: 100%;
  height: 30px;
  filter: blur(2rem);
  animation: pulse_3011 4s infinite;
  z-index: -1;
}

.circle:nth-of-type(1) {
  background: rgba(254, 83, 186, 0.636);
}

.circle:nth-of-type(2) {
  background: rgba(142, 81, 234, 0.704);
}

.btn:hover #container-stars {
  z-index: 1;
  background-color: #212121;
}

.btn:hover {
  transform: scale(1.1);
}

.btn:active {
  border: double 4px #fe53bb;
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
}

.btn:active .circle {
  background: #fe53bb;
}

#stars {
  position: relative;
  background: transparent;
  width: 200rem;
  height: 200rem;
}

#stars::after {
  content: "";
  position: absolute;
  top: -10rem;
  left: -100rem;
  width: 100%;
  height: 100%;
  animation: animStarRotate 90s linear infinite;
}

#stars::after {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
}

#stars::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
}

#stars::before {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
  opacity: 0.5;
}

@keyframes animStar {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-135rem);
  }
}

@keyframes animStarRotate {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0);
  }
}

@keyframes gradient_301 {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse_3011 {
  0% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

.btn-book {
  background: linear-gradient(45deg, #f19b55, #ec4b1a, #ee2424);
  color: white;
  padding: 10px 25px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.btn-book:hover {
  background-color: #c0392b;
}

/* ส่วนของฟอร์มการจอง */
.booking-form {
  margin-top: 40px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.booking-form h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.btn-submit {
  background-color: #2ecc71;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
