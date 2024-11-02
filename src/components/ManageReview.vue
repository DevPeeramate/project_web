<template>
  <div class="manage-review-page container">
    
      <div class=" justify-content-center">
        <h1 class="page-title">Manage Review</h1>
        <p class="page-description">This is the Manage Review page.</p>
      </div>
    
    <router-link to="/AdminHome" style="text-decoration: none">
      <button class="btn btn-xs btn-primary mb-3">Menu</button>
    </router-link>

    <div v-if="reviews.length === 0" class="no-review-message">
      <p>No Reviews</p>
    </div>
    
    
      <div class="review-list mt-5">
        <div class="review-card" v-for="review in reviews" :key="review.id">
          <div class="review-user-info">
            <img :src="`http://localhost:3000/img_mem/${review.username}.jpg`" alt="User Avatar" class="avatar rounded-circle" />
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
              </div>
            </div>
          </div>
          <p class="review-comment">{{ review.comment }}</p>
          <small class="review-date">Reviewed on {{ new Date(review.reviewDate).toLocaleDateString() }}
            <div class="d-flex justify-content-center">
              <button @click="deleteReview(review.reviewId,review.username)" class="btn btn-xs btn-danger mt-2">Delete</button>
            </div>
          </small>
        </div>
      </div>
  </div>
</template>
 
<script>
import axios from "axios";
// import EditRoom from "./EditRoom.vue";
axios.defaults.withCredentials = true;
export default {
  name: "ManageReview",
  // components:{EditRoom},
  data() {
    return {
      reviews: [],
      // role: null,
    };
  },
  mounted() {
    this.allReviews();
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
    allReviews() {
      axios.get("http://localhost:3000/review").then((res) => {
        this.reviews = res.data;
      });
    },
   deleteReview(id, username) {
      console.log(id);
      const cf = window.confirm("ต้องการลบความคิดเห็นนี้?");
      if (cf) {
        axios
          .delete(
            `http://localhost:3000/myReview/${username}/${id}`
          )
          .then((res) => {
            console.log(res);
            this.allReviews();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // this.$router.push({ name: 'EditRoom', params: {data: JSON.stringify(roomId)} });
  },
};
</script>
 
<style scoped>
/* .manage-review {
  max-width: 1400px;
  border-radius: 10px;
  background: linear-gradient(45deg, #ffffff, #a9bbff, #cbf3ff);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
} */

.manage-review-page {
  padding: 20px;
  padding: 20px;
  border-radius: 30px;
  background: linear-gradient(45deg, #cbafff, #917aff, #7de1ff);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.page-title {
  font-size: 2.5rem;
  color: #343a40;
  text-align: center;
  margin-bottom: 10px;
}

.page-description {
  font-size: 1.2rem;
  color: #6c757d;
  text-align: center;
  margin-bottom: 20px;
}

.review-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.review-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1000px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex; /* ทำให้เป็น Flex Container */
  justify-content: space-between; /* จัดให้อยู่ห่างกัน */
  align-items: center; /* จัดให้อยู่กลางแนวตั้ง */
}

.review-user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.username {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.rating {
  color: #ffcd3c;
  font-size: 1.2rem;
}

.star.filled {
  color: #ffcd3c;
}

.review-comment {
  margin: 10px 0;
  font-size: 1rem;
  color: #555;
}

.review-date {
  color: #777;
  font-size: 0.9rem;
}

.btn {
  font-size: 1.5rem;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-xs {
  font-size: 1.3rem;
  padding: 10px 20px;
  width: auto;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: darkred;
}
</style>