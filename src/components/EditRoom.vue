<template>
  <div class="edit-room-page">
    <form @submit.prevent="updateRoom" class="edit-room-form">
      <div class="add-room-form">
        <div class="card-body">
          <h1 class="card-title text-secondary text-center">เเก้ไขห้อง</h1>

          <!-- ชื่อห้อง -->
          <div class="form-group">
            <label for="roomName" class="form-label">ชื่อห้อง</label>
            <select
              class="form-control"
              id="roomName"
              required
              v-model.trim="roomName"
            >
              <option disabled value="">เลือกชื่อห้อง</option>
              <option value="Standard Room">Standard Room</option>
              <option value="Luxury Room">Luxury Room</option>
              <option value="Suite Room">Suite Room</option>
            </select>
          </div>

          <!-- สถานะห้อง -->
          <div class="form-group">
            <label for="roomStatus" class="form-label">สถานะห้อง</label>
            <select
              class="form-control"
              id="roomStatus"
              required
              v-model.trim="roomStatus"
            >
              <option value="Free">Free</option>
              <option value="Full">Full</option>
            </select>
          </div>

          <!-- ขนาดห้อง -->
          <div class="form-group">
            <label for="roomSize" class="form-label">ขนาดห้อง / คน</label>
            <select
              class="form-control"
              id="roomSize"
              required
              v-model.trim="roomSize"
            >
              <option disabled value="">(จำนวนคน)</option>
              <option value="1">1 คน</option>
              <option value="2">2 คน</option>
              <option value="3">3 คน</option>
              <option value="4">4 คน</option>
            </select>
          </div>

          <!-- รายละเอียดห้อง -->
          <div class="form-group">
            <label for="roomDetail" class="form-label">รายละเอียดห้อง</label>
            <input
              type="text"
              class="form-control"
              id="roomDetail"
              required
              v-model.trim="roomDetail"
            />
          </div>

          <!-- ราคาห้อง -->
          <div class="form-group">
            <label for="roomPrice" class="form-label">ราคาห้อง</label>
            <input
              type="text"
              class="form-control"
              id="roomPrice"
              required
              v-model.trim="roomPrice"
            />
          </div>

          <!-- อัพโหลดรูปภาพ -->
          <div class="upload-section">
            <div v-if="imageExists" class="image-preview">
              <img
                :src="`http://localhost:3000/img_room/${roomId}_${roomName}.jpg?timestamp=${imageTimestamp}`"
                :alt="roomName"
                class="room-image"
              />
            </div>
            <div v-else class="image-preview">
              <img
                :src="`http://localhost:3000/img_room/default.jpg`"
                :alt="roomName"
                class="room-image"
              />
            </div>
            <div>
              <form @submit.prevent="uploadFile">
                <input
                  class="form-control mb-3"
                  type="file"
                  @change="onFileChange"
                />
              </form>
              <button class="btn upload" type="submit">Upload</button>
              <button class="btn submit" type="submit">
                <i class="bi bi-check-lg"></i>&nbsp;Submit
              </button>
            </div>
            <div v-if="fileMessage" class="alert alert-success mt-3">
              {{ fileMessage }}
            </div>
          </div>

          <!-- <div v-if="isMore === true">
              <form @submit.prevent="uploadFile" class="edit-rooms">
                <div class="mb-3">
                  <input
                    class="form-control mb-3"
                    type="file"
                    @change="onFileChange"
                  />
                </div>
                <div class="d-flex justify-content-center gap-2">
                  <button class="btn btn-sm btn-primary" type="submit">
                    Upload
                  </button>
                  <button @click="submit()" class="btn btn-xs btn-danger">
                    <i class="bi bi-check-lg"></i>&nbsp;Submit
                  </button>
                  <button @click="DontShow()" class="btn btn-xs btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <div class="action-section mt-4 text-center">
              <div v-if="isMore === false">
                <button @click="IsShow()" class="btn btn-xs btn-primary">
                  แก้ไข Rooms
                </button>
              </div>
            </div> -->

          <!-- <div v-if="fileMessage" class="alert alert-success mt-3">
              {{ fileMessage }}
            </div> -->
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "EditRoom",
  data() {
    return {
      // earthRoomId: null,
      // floor: null,
      roomId: null,
      roomName: null,
      roomSize: null,
      roomDetail: null,
      roomPrice: null,
      roomStatus: null,
      roomData: [],
      dataId: null,
      backendMessage: null,
      imageExists: false,
      fileMessage: null,
      file: null,
      imageTimestamp: Date.now(), // ใช้เป็น query parameter
      // roomData: null
    };
  },
  async mounted() {
    this.dataId = this.$route.params.dataTest;
    axios
      .get(`http://localhost:3000/admin/room/${this.dataId}`)
      .then((res) => {
        // console.log(res.data[0]);
        this.roomData = res.data;
        this.roomId = this.roomData[0].roomId;
        this.roomName = this.roomData[0].roomName;
        this.roomSize = this.roomData[0].roomSize;
        this.roomDetail = this.roomData[0].roomDetail;
        this.roomPrice = this.roomData[0].roomPrice;
        this.roomStatus = this.roomData[0].roomStatus;
        this.checkImage();
        // this.imageTimestamp = Date.now();
        // console.log(this.roomData[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    // ทำการ Uploadfile เมื่อถูกSubmit
    async uploadFile() {
      if (!this.file) {
        this.fileMessage = "เลือก File ก่อน";
        return;
      }
      // อ่านค่าจาก Form เพื่อ POST
      const formData = new FormData();
      formData.append("file", this.file);
      // กำหนด endpoint และกำหนด Header ว่าเป็นการส่ง file
      try {
        const response = await axios.post(
          `http://localhost:3000/admin/uploadRoomImage/${this.roomId}/${this.roomName}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.fileMessage = response.data.message;
        // ให้ทำการตรวจสอบ image อีกครั้ง
        this.checkImage();
        this.imageTimestamp = Date.now();
      } catch (err) {
        this.fileMessage = "fail";
      }
    },

    checkImage() {
      console.log("Is Success " + this.imageExists);
      console.log(this.roomName);
      const image = new Image();
      image.src = `http://localhost:3000/img_room/${this.roomId}_${this.roomName}.jpg`;
      image.onload = () => {
        console.log("Is Success " + this.imageExists);
        // รูปภาพโหลดสำเร็จ
        this.imageExists = true;
      };
      console.log("Is Success " + this.imageExists);
      image.onerror = () => {
        // รูปภาพไม่สามารถโหลดได้

        this.imageExists = false;
      };
    },

    async updateRoom() {
      let room = {
        roomName: this.roomName,
        roomSize: this.roomSize,
        roomDetail: this.roomDetail,
        roomPrice: this.roomPrice,
        roomStatus: this.roomStatus,
      };

      try {
        const res = await axios.put(
          `http://localhost:3000/admin/putRoom/${this.dataId}`,
          room
        );
        this.backendMessage = res.data.messagePutRoom;
        if (this.backendMessage == "success") {
          this.$router.push("/ManageRoom");
        }
      } catch (err) {
        console.log(err);
      }

      // axios
      //   .put(`http://localhost:3000/admin/putRoom/${this.dataId}`, {

      //     roomName: this.roomName,
      //     roomSize: this.roomSize,
      //     roomDetail: this.roomDetail,
      //   })
      //   .then((res) => {
      //     console.log(res.data);
      //     this.roomData = res.data;
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });
    },
  },
};
</script>

<style scoped>
.edit-room-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120vh;
  border-radius: 100px;
  background: linear-gradient(135deg, #d3cce3, #e9e4f0);
  padding: 40px;
}

.edit-room-form {
  background-color: #ffffff;
  border-radius: 100px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  max-width: 1000px;
  padding: 150px 50px;
  width: 100vh;
  transition: all 0.3s ease;
}

.edit-room-form:hover {
  transform: scale(1.02);
}

.form-group {
  margin-bottom: 20px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-preview {
  width: 300px;
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.room-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.form-control {
  flex: 1; /* ทำให้ input ขยายเต็มพื้นที่ */
}

.btn {
  margin-left: 10px; /* เพิ่มระยะห่างระหว่างปุ่ม */
}


.upload {
  background: linear-gradient(45deg, #f19b55, #ec4b1a, #ee2424);
}

.submit {
  background: linear-gradient(45deg, #bdff80, #7fff4c, #0edb7c);
}

.justify-content-center {
  justify-content: center;
}

.upload,
.submit {
  width: 150px;
}
</style>