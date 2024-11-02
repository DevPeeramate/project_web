<template>
  <div class="review-container">
    <h2 class="review-title">Customer Reviews</h2>

    <!-- รีวิวที่มีอยู่ -->
      <div class="review-card" v-for="review in reviews" :key="review.id">
    <div class="review-list">
        <div class="review-user-info">
          <img :src="`http://localhost:3000/img_mem/${review.username}.jpg`" alt="User Avatar" class="avatar" />
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
        <small class="review-date"
          >Reviewed on {{ new Date(review.reviewDate).toLocaleDateString() }}</small
        >
      </div>
    </div>

    <!-- ฟอร์มเพิ่มรีวิว -->
    <div v-if="this.username == null" class ="unauthorized">
    <h2>Access Denied</h2>
    <p>Please login to leave a review.</p>
  </div>
    <div v-if="this.username != null" class="review-form">
      <h3>Leave Your Review</h3>
      <form @submit="submitReview">
        <div class="form-group">
          <label for="rating">Rating:</label>
          <select v-model="score" id="rating" required>
            <option disabled value="">Select a rating</option>
            <option v-for="n in stars" :key="n" :value="n">{{ stars[n] }} ★</option>
          </select>
        </div>

        <div class="form-group">
          <label for="comment">Comment:</label>
          <textarea
            v-model="comment"
            id="comment"
            rows="4"
            placeholder="Write your review here..."
            required
          ></textarea>
        </div>
        <div>
          <button type="submit" class="btn-submit ">Submit Review</button>
        </div>
        
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      // ข้อมูลตัวอย่างสำหรับรีวิวที่มีอยู่แล้ว
      reviews: [],
      username: null,
      score: null,
      comment: null,
      stars: [0, 1, 2, 3, 4, 5],
      // ข้อมูลรีวิวใหม่
      // newReview: {
      //   rating: "",
      //   comment: "",
      // },
    };
  },
  async mounted() {
    this.allReviews();
    this.chkSession();

  },
  methods: {
    async chkSession() {
      try {
        await axios.get(`http://localhost:3000/session`).then((res) => {
          this.username = res.data.username;
          console.log(this.username);
          // if (this.username) {
          //   this.allReviews();
          // }
        });
      } catch (err) {
        console.log(err);
      }
    },
    allReviews() {
      axios
        .get("http://localhost:3000/review")
        .then((res) => {
          this.reviews = res.data;
        })
    },
    async submitReview() {
      let review = {
        username: this.username,
        score: this.score,
        comment: this.comment,
      };
      try {
        await axios.post(`http://localhost:3000/review`, review);
      } catch (err) {
        console.log(err);
      }
    },
  },
};

</script>

<style>
.review-container {
  padding: 30px;
  border-radius: 30px;
  background: linear-gradient(45deg, #cbafff, #917aff, #7de1ff);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

.review-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

/* การจัดการรีวิวการ์ด */
.review-card {
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.review-user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border: 2px solid #cbafff;
}

.review-user-details {
  flex-grow: 1;
}

.username {
  font-size: 1.2rem;
  font-weight: bold;
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

.review-comment {
  margin: 15px 0;
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
}

.review-date {
  font-size: 0.9rem;
  color: #888;
}

/* Unauthorized Section */
.unauthorized {
  text-align: center;
  padding: 40px;
}

.unauthorized h2 {
  color: red;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.unauthorized p {
  color: #fff;
  font-size: 1rem;
}

/* การจัดการฟอร์ม */
.review-form {
  background-color: #fff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.review-form h3 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  color: #333;
}

textarea {
  resize: none;
}

.btn-submit {
  background-color: #3498db;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
}

.btn-submit:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

</style>