<template>
  <div class="profile-page container">
    <h1 class="topic">My Profile</h1>
    <div class="row-profile">
      <div class="con-profile">

        <!-- รูปโปรไฟล์ -->
        <div class="profile-image mt-5">
          <div class="card" style="width: 50rem ,height" v-if="imageExists">
            <img
              :src="`http://localhost:3000/img_mem/${username}.jpg?timestamp=${imageTimestamp}`"
              :alt="username"
              class="img-fluid profile-picture"
            />
          </div>
          <div v-else>
            <img
              :src="`http://localhost:3000/img_mem/default.jpg`"
              :alt="username"
              class="img-fluid profile-picture"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="user-info mt-4">
      <h3 class="user-name">Name : {{ this.memName }}</h3>
      <p class="user-detail">Email : {{ this.email }}</p>
      <p class="user-detail">Gender : {{ this.gender }}</p>
      <p class="user-detail">Phone : {{ this.phone }}</p>
    </div>

    <div v-if="isShow === true">
      <form @submit.prevent="uploadFile" class="upload-form">
        <div class="mb-3">
          <input
            class="form-control"
            type="file"
            id="formFile"
            @change="onFileChange"
            required
          />
        </div>

        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-sm btn-primary" type="submit">Upload</button>
          <button @click="deleteuser()" class="btn btn-xs btn-danger">
            Delete Account
          </button>
          <button @click="DontShow()" class="btn btn-xs btn-secondary">
            Cancel
          </button>
        </div>

      </form>
    </div>

    <div class="action-section mt-4 text-center">
      <div v-if="isShow === false">
        <button @click="IsShow()" class="btn btn-xs btn-primary">
          แก้ไข Profile
        </button>
      </div>
    </div>

    <h1 class="p-5">My Reviews</h1>
    <div v-if="reviews.length === 0">
      <p class="no-review-message">No Reviews</p>
    </div>
    <div
      v-else
      class="review-card"
      v-for="(review, index) in reviews"
      :key="review.id"
    >
      <div class="review-user-info">
        <img
          :src="`http://localhost:3000/img_mem/${review.username}.jpg?timestamp=${imageTimestamp}`"
          alt="User Avatar"
          class="avatar rounded-circle"
        />
        <div class="review-user-details">
          <h3 class="username">{{ review.username }}</h3>
          <div class="rating">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= review.score }"
              >★</span
            >
            <input
              v-if="isEditing[index] != null"
              type="number"
              v-model="review.score"
              min="0"
              max="5"
              step="1"
              class="score-input"
            />
          </div>
        </div>
      </div>
      <br />
      <div class="reviewContainer">
        <textarea
          v-if="isEditing[index] == index"
          type="text"
          class="reviewComment"
          v-model="review.comment"
          style="height: 100px; width: 800px;"
        ></textarea>
        <p v-else class="reviewComment">{{ review.comment }}</p>
      </div>
      <br />

      <!-- <span :contenteditable="isEditing" @blur="isEditing = false" v-text="review.score + '/5'"></span>
      <br>
    <span :contenteditable="isEditing" @blur="isEditing = false" v-text="review.comment"></span>
    <br> -->
      <!-- <input v-if="isEditing" type="number" v-model="review.score" min="1" max="5">
    <span v-else>{{ review.score }}/5</span> -->

      <!-- <input v-if="isEditing" type="text" v-model="review.comment"> -->
      <!-- <span v-else>{{ review.comment }}</span> -->
      <!-- <button v-if="!isEditing" @click="isEditing = true">Edit</button> -->
      <!-- <button v-else @click="saveChanges">OK</button> -->

      <small class="review-date"
        >Reviewed on
        {{ new Date(review.reviewDate).toLocaleDateString() }}</small
      >
      <small v-if="review.reviewUpdateDate != null" class="review-date mx-5"
        >Updated on
        {{ new Date(review.reviewUpdateDate).toLocaleDateString() }}</small
      >
      <div class="action-section mt-4 text-center">
        <button
          v-if="isEditing[index] == null"
          class="btn btn-xs btn-primary"
          @click="buttonFunc(review.score, review.comment, index)"
        >
          แก้ไข
        </button>
      </div>

      <!-- <button v-else class="btn btn-primary" @click="isEditing=false">แก้ไข</button> -->
      <!-- <button v-else class="btn btn-primary" @click="saveChanges(review)">save</button> -->
      <button
        v-if="isEditing[index] == index"
        class="btn btn-primary"
        @click="saveChanges(review, index)"
      >
        save
      </button>
      <button
        v-if="isEditing[index] == index"
        class="btn btn-xs btn-secondary"
        @click="
          (isEditing[index] = null),
            (review.score = oldScore),
            (review.comment = oldComment)
        "
      >
        Cancel
      </button>
      <div
        @click="deleteMyReview(review.reviewId, review.username)"
        class="action-section mt-4 text-center"
      >
        <button class="btn btn-xs btn-danger">Delete</button>
      </div>
    </div>
  </div>

  <div class="row g-3 mt-3">
    <div class="col-md-6 col-sm-12"></div>
    <div class="col-auto">
      <div
        class="alert alert-success"
        v-if="fileMessage != 'fail' && fileMessage != null"
      >
        {{ fileMessage }}
      </div>
    </div>
    <div class="col-auto"></div>
  </div>

  <!-- <span :contenteditable="isEditing" @blur="isEditing = false" v-text="rating + '/5'"></span>
    <span :contenteditable="isEditing" @blur="isEditing = false" v-text="comment"></span>
    <button @click="isEditing = true">Edit</button> -->
</template>
 
 
<script>
import axios from "axios"; //1.import axios มาใช้งาน
import { EventBus } from "@/event-bus";
// import { is } from "core-js/core/object";
axios.defaults.withCredentials = true;
export default {
  name: "PageMember",
  data() {
    return {
      oldScore: null,
      oldComment: null,
      isEditing: [],
      isShow: false,
      reviews: [],
      username: null,
      email: null,
      memName: null,
      gender: null,
      phone: null,
      imageExists: false,
      fileMessage: null,
      file: null,
      imageTimestamp: Date.now(), // ใช้เป็น query parameter
    };
  },
  async mounted() {
    await this.chkSession();
    this.checkImage();
    this.myreview();
  },
  methods: {
    buttonFunc(reviewScore, reviewComment, index) {
      console.log(index);
      console.log(reviewScore);
      this.isEditing[index] = index;
      this.oldScore = reviewScore;
      this.oldComment = reviewComment;
    },
    // scoreFunc(reviewScore) {
    //   this.oldScore = this.reviews[0].score;
    //   console.log(this.newScore);

    // },
    saveChanges(reviewData, index) {
      let reviewSendData = {
        reviewId: reviewData.reviewId,
        username: reviewData.username,
        score: reviewData.score,
        comment: reviewData.comment,
      };
      console.log(reviewSendData);
      try {
        axios
          .put(
            `http://localhost:3000/myReview/${this.username}`,
            reviewSendData
          )
          .then(() => {
            this.isEditing[index] = null;
            this.myreview();
          });
      } catch (error) {
        console.log(error);
      }
    },
    IsShow() {
      this.isShow = true;
    },
    DontShow() {
      this.isShow = false;
    },
    // อ่านค่าจาก input file เมื่อถูกเรียก
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
          "http://localhost:3000/uploadProfileImage/" + this.username,
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
    myreview() {
      axios
        .get(`http://localhost:3000/myreview/${this.username}`)
        .then((res) => {
          this.reviews = res.data;
          console.log(res.data);
          console.log(this.reviews[0].reviewId);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async chkSession() {
      await axios
        .get(`http://localhost:3000/session`)
        .then((res) => {
          console.log(res.data);
          this.username = res.data.username;
          this.email = res.data.email;
          this.memName = res.data.name;
          this.gender = res.data.gender;
          this.phone = res.data.phone;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    checkImage() {
      const image = new Image();
      image.src = `http://localhost:3000/img_mem/${this.username}.jpg`;
      image.onload = () => {
        // รูปภาพโหลดสำเร็จ
        this.imageExists = true;
      };
      image.onerror = () => {
        // รูปภาพไม่สามารถโหลดได้
        this.imageExists = false;
      };
    },
    deleteuser() {
      if (confirm("คุณต้องการลบบัญชีนี้หรือไม่?")) {
        axios
          .delete(`http://localhost:3000/delete/${this.username}`) // ลบข้อมูลการจองที่มี ID ตรงกัน
          .then((res) => {
            console.log(res.data.messageDeleteAccount);
            if (res.data.messageDeleteAccount == "success") {
              sessionStorage.clear();
              EventBus.emit("deleteok");
              this.$router.push("/login");
            }

            alert("ลบบัญชีสำเร็จ");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    deleteMyReview(id, username) {
      console.log(id);
      const cf = window.confirm("ต้องการลบความคิดเห็นนี้?");
      if (cf) {
        axios
          .delete(`http://localhost:3000/myReview/${username}/${id}`)
          .then((res) => {
            console.log(res);
            this.myreview();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>
 
<style scoped>

.profile-page {
  padding: 30px;
  border-radius: 30px;
  background: linear-gradient(45deg, #cbafff, #917aff, #7de1ff);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.profile-card {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.profile-image {
  background: transparent;
  display: flex;
  justify-content: center;
}

.profile-picture {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10%;
  border: 3px solid #007bff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.user-info {
  text-align: left;
  margin-top: 20px;
  color: #ffffff;
}

.user-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff; /* เปลี่ยนสีข้อความเป็นสีขาว */
}

.user-detail {
  font-size: 1.1rem;
  color: #fff; /* เปลี่ยนสีข้อความเป็นสีขาว */
  margin-bottom: 10px;
}

.action-section {
  margin-top: 20px;
  text-align: center;
}

.upload-form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.upload-form .form-control {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
}

.btn {
  font-size: 1rem;
  padding: 8px 15px;
  margin: 5px;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn:hover {
  transform: scale(1.05);
}

.review-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.review-user-info {
  display: flex;
  align-items: center;
}

.avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border: 2px solid #007bff;
}

.username {
  font-size: 1.2rem;
  color: #333;
}

.rating {
  display: flex;
}

.star {
  font-size: 20px;
  color: #ddd;
}

.filled {
  color: #ffc107;
}
.reviewContainer {
  display: flex;
  align-items: center;
}
.reviewComment {
  margin-top: 10px;
  color: #555;
  font-size: 1rem;
}

.review-date {
  font-size: 0.9rem;
  color: #888;
  display: inline-block;
}

.no-review-message {
  text-align: center;
  color: red;
  font-size: 1.5rem;
  margin-top: 20px;
}
</style>

 