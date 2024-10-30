import database from "../service/database.js";

export async function postReview(req, res) {
    console.log("POST /review is requested");
    const bodyData = req.body;
    try {
        if (req.body.username == null || req.body.score == null ) {
            console.log("Fail in null");
            return res.json({ messageAddReview: "fail" });
        }
        
        const currentDate = new Date();
        const result = await database.query({
            text: `INSERT INTO reviews("username", "score","comment","reviewDate") VALUES ($1, $2, $3, $4)`,
            values: [
                req.body.username,
                req.body.score,
                req.body.comment,
                currentDate,
            ],
        });
        console.log("success");
        return res.json({ messageAddReview: "success" });
    } catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageAddReview: "fail" });
    }
}

export async function getAllReview(req, res) {
    console.log("GET /AllReview is requested");
    try {
        
        const result = await database.query({
            text: `SELECT * FROM reviews`,
        });
        console.log("success");
        return res.json(result.rows);
    } catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageGetReview: "fail" });
    }
}

export async function getMyReview(req, res) {
    console.log("GET /myReview is requested");
    try {
        if (req.params.username == null ) {
            console.log("Fail in null");
            return res.json({ messageGetReview: "fail" });
        }
        const result = await database.query({
            text: `SELECT * FROM reviews WHERE "username" = $1`,
            values: [req.params.username],
        });
        console.log("success");
        return res.json(result.rows);
    } catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageGetReview: "fail" });
    }
}

export async function updateReview(req, res) {
    console.log("PUT /review is requested");
    try {
        if (req.params.username == null  ) {
            console.log("Fail in null");
            return res.json({ messageUpdateReview: "fail" });
        }
        const existsResult = await database.query({
            text: `SELECT * FROM reviews WHERE "reviewId" = $1`,
            values: [req.body.reviewId],
        });

        if(!existsResult.rows[0]) {
            console.log("fail in exists");
            return res.json({ messageUpdateReview: "fail" });
        }
        const currentDate = new Date();
        const result = await database.query({
            text: `UPDATE reviews SET "score" = $1, "comment" = $2 , "reviewUpdateDate" = $3 WHERE "reviewId" = $4`,
            values: [req.body.score, req.body.comment, currentDate ,req.body.reviewId],
        });
        console.log("success");
        return res.json({ messageUpdateReview: "success" });
    } catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageUpdateReview: "fail" });
    }
}

export async function deleteReview(req, res) {
    console.log("DELETE /review is requested");
    try {
        if (req.params.username == null ) {
            console.log("Fail in null");
            return res.json({ messageDeleteReview: "fail" });
        }

        const existsResult = await database.query({
            text: `SELECT * FROM reviews WHERE "reviewId" = $1`,
            values: [req.params.reviewId],
        });
        if(!existsResult.rows[0]) {
            console.log("fail in exists");
            return res.json({ messageDeleteReview: "fail" });
        }
        const result = await database.query({
            text: `DELETE FROM reviews WHERE "reviewId" = $1`,
            values: [req.params.reviewId],
        });
        console.log("success");
        return res.json({ messageDeleteReview: "success" });
    } catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageDeleteReview: "fail" });
    }
}