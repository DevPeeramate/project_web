<template>
  <div class="add-room-page">
    <div class="card add-room-form">
      <h1 class="page-title">เพิ่มห้องใหม่</h1>
      <p class="page-description">กรุณากรอกข้อมูลห้องให้ครบถ้วน</p>
      <form @submit.prevent="handleSubmit()">
        <!-- เลขห้อง -->
        <div class="form-group">
          <label for="roomId">เลขห้อง:</label>
        <input type="text" required v-model="roomId" />
        </div>

        <!-- ชั้น -->
        <div class="form-group">
          <label for="floor" class="form-label">ชั้น</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-building"></i></span>
            <select type="text"  class="form-control" v-model="floor" required>
              <option disabled value="">เลือกชั้น</option>
              <option value="1">1 ชั้น</option>
              <option value="2">2 ชั้น</option>
              <option value="3">3 ชั้น</option>
            </select>
          </div>
        </div>

        <!-- ชื่อห้อง -->
        <div class="form-group">
          <label for="roomName" class="form-label">ชื่อห้อง</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-house-door"></i></span>
            <select type="text"  class="form-control" v-model="roomName" required>
              <option disabled value="">เลือกชื่อห้อง</option>
              <option value="Standard Room">Standard Room</option>
              <option value="Luxury Room">Luxury Room</option>
              <option value="Suite Room">Suite Room</option>
            </select>
          </div>
        </div>

        <!-- สถานะห้อง -->
        <div class="form-group">
          <label for="roomStatus" class="form-label">สถานะห้อง</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-lightbulb"></i></span>
            <select type="text"  class="form-control" v-model="roomStatus" required>
              <option disabled value="">เลือกสถานะห้อง</option>
              <option value="Free">Free</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>

        <!-- ขนาดห้อง (จำนวนคน) -->
        <div class="form-group">
          <label for="roomSize" class="form-label">ขนาดห้อง (จำนวนคน)</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-people"></i></span>
            <select type="text"  class="form-control" v-model="roomSize" required>
              <option disabled value="">เลือกขนาดห้อง</option>
              <option value="1">1 คน</option>
              <option value="2">2 คน</option>
              <option value="3">3 คน</option>
              <option value="4">4 คน</option>
            </select>
          </div>
        </div>

        <!-- รายละเอียดห้อง -->
        <div class="form-group">
          <label for="roomDetail" class="form-label">รายละเอียดห้อง</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-info-circle"></i></span>
            <textarea
              type="text" 
              class="form-control"
              id="roomDetail"
              rows="3"
              placeholder="เพิ่มรายละเอียดห้อง เช่น สิ่งอำนวยความสะดวก"
              v-model="roomDetail"
              required
            ></textarea>
          </div>
        </div>

        <!-- ราคาห้อง -->
        <div class="form-group">
          <label for="roomPrice" class="form-label">ราคาห้อง</label>
          <div class="input-group">
            
        <input type="text" required v-model="roomPrice" />
          </div>
        </div>

        <!-- <label for="roomPicture">รูปภาพห้อง:</label> -->
        <!-- <div class="card mt-5" style="width: 18rem" v-if="imageExists">
          <img :src="`http://localhost:3000/img_room/${roomName}.jpg?timestamp=${imageTimestamp}`" :alt="roomName" />
        </div> -->
        <!-- <div class="card mt-5" style="width: 18rem" v-if="imageExists">
          <img :src="imageSrc" alt="Uploaded Image" />
        </div> -->
        <!-- รูปภาพห้อง -->
        <div class="form-group mb-4">
          <label for="roomPicture" class="form-label">รูปภาพห้อง</label>
          <div class="d-flex justify-content-center mt-4">
            <div v-if="imageSrc" class="image-preview mb-3" style="width: 18rem">
            <img :src="imageSrc" alt="Preview" class="preview-image" />
          </div>
          </div>
          
        </div>
        
        
        <!-- <div class="card mt-5" style="width: 18rem" v-else>
          <img :src="`http://localhost:3000/img_room/default.jpg`" :alt="roomName" />
        </div> -->
        <div class="form-group mb-4">
          <form @submit.prevent="uploadFile">
            <input type="file" class="form-control"  id="roomPicture" @change="onFileChange" required />
            <div class="d-flex justify-content-center mt-4">

              <button class="btn btn-xs btn-up" type="submit">
                Upload
              </button>

              <button class="btn btn-xs btn-sub" type="submit" :disabled="!buttonDisable">
                บันทึก
              </button>
              
              <router-link to="/AdminHome" style="text-decoration: none">
                <button class="btn btn-xs btn-menu">Menu</button>
              </router-link>

            </div>
          </form>
        </div>
          
        
        <!-- ปุ่มอัพโหลดและบันทึก -->
        <!-- <div class="d-flex justify-content-center mt-4">
          <button class="btn btn-xs btn-primary" type="submit" :disabled="!buttonDisable">บันทึก</button>
        </div> -->
      </form>
      <!-- <p v-if="backendMessage == 'success'" class="alert alert-success mt-3">
        ลงทะเบียนสำเร็จ-{{ backendMessage }}</p>
      <p v-else-if="backendMessage == 'fail'" class="alert alert-danger mt-3">
        ลงทะเบียนผิดพลาด-{{ backendMessage }}</p> -->
    </div>
  </div>
</template>


<script>
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "AddRoom",
  data() {
    return {
      roomId: null,
      floor: null,
      roomName: null,
      roomSize: null,
      roomDetailn: null,
      roomPrice: null,
      roomStatus: null,
      backendMessage: null,// ข้อมูลห้องที่จะทำการแก้ไข
      imageExists: false,
      fileMessage: null,
      file: null,
      imageTimestamp: Date.now(), // ใช้เป็น query parameter
      imageSrc: null,
      buttonDisable: false
    };
  }, async mounted() {
    this.checkImage();
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    // ทำการ Uploadfile เมื่อถูกSubmit
    async uploadFile() {
      const file = this.file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageExists = true;
      this.imageSrc = e.target.result;
  };
  reader.readAsDataURL(file);
  this.buttonDisable = true;
      // if (!this.file) {
      //   this.fileMessage = "เลือก File ก่อน";
      //   return;
      // }
      // // อ่านค่าจาก Form เพื่อ POST
      // const formData = new FormData();
      // formData.append("file", this.file);
      // // กำหนด endpoint และกำหนด Header ว่าเป็นการส่ง file
      // try {
      //   const response = await axios.post(
      //     `http://localhost:3000/admin/uploadRoomImage/${this.roomName}`,
      //     formData,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     }
      //   );
      //   this.fileMessage = response.data.message;
      //   // ให้ทำการตรวจสอบ image อีกครั้ง
      //   this.checkImage();
      //   this.imageTimestamp = Date.now();
      // } catch (err) {
      //   this.fileMessage = "fail";
      // }
    },
    async uploadTrueFile() {
      console.log(this.roomId + " " + this.roomName);
      console.log("this is uploadTrueFile");
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
      // console.log("Is Success " + this.imageExists);
      console.log(this.roomId+this.roomName);
      const image = new Image();
      image.src = `http://localhost:3000/img_room/${this.roomId}_${this.roomName}.jpg`;
      image.onload = () => {
        // console.log("Is Success " + this.imageExists);
        // รูปภาพโหลดสำเร็จ
        this.imageExists = true;
        console.log("Is Success " + this.imageExists);
      };
      
      image.onerror = () => {
        // รูปภาพไม่สามารถโหลดได้
        console.log("Is Success " + this.imageExists);
        this.imageExists = false;
      };
    },
    async handleSubmit() {
      let rooms = {
        roomId: this.roomId,
        floor: this.floor,
        roomName: this.roomName,
        roomStatus:this.roomStatus,
        roomSize: this.roomSize,
        roomDetail: this.roomDetail,
        roomPrice: this.roomPrice,
      };
      try {
        console.log("is this room id" + this.roomId);
        const response = await axios.post(`http://localhost:3000/admin/addRoom`, rooms);
        console.log(this.roomId);
        console.log(this.roomName);
        console.log(this.floor)
        console.log(this.roomSize);
        console.log(this.roomDetail);
        console.log(this.roomPrice);
        console.log(this.roomStatus);
        this.backendMessage = response.data.messageAddRoom;
        if (this.backendMessage == "success") {
          this.uploadTrueFile()
          this.$router.push('/ManageRoom')
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>

.add-room-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  border-radius: 100px;
  background: linear-gradient(135deg, #d3cce3, #e9e4f0);
  padding: 40px;
}

.add-room-form {
  background-color: #ffffff;
  border-radius: 50px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  max-width: 1000px;
  padding: 50px;
  width: 100vh;
  transition: all 0.3s ease;
}

.add-room-form:hover {
  transform: scale(1.02);
}

.page-title {
  font-size: 2.5rem;
  color: #6c757d;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.page-description {
  font-size: 1.2rem;
  color: #495057;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: bold;
  color: #495057;
}

.input-group-text {
  background-color: #6c757d;
  color: #ffffff;
  border: none;
}

.input-group .form-control {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

textarea.form-control {
  resize: vertical;
}

.btn {
  font-size: 1.5rem;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-left: 35px; /* เพิ่มระยะห่างระหว่างปุ่ม */
}

.btn-xs {
  font-size: 1.3rem;
  padding: 10px 20px;
  width: auto;
  
}

.btn-menu{
  background-color: #4486e9;
}

.btn-menu:hover {
  color: #ddd;
  background: #436fa8;
}

.btn-sub {
  color: #ffffff9f;
  background-color: #f39843;
  border: none;
}

.btn-sub:hover {
  color: #ffffff9f;
  background-color: #d1d080;
}

.btn-up {
  background-color: #16c53c;
  border: none;
}

.btn-up:hover {
  color: #ffffff9f;
  background-color: #06802f;
}

.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
}

.preview-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>