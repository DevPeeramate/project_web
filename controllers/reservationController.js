import database from "../service/database.js";


export async function addCart(req, res) {
    console.log("POST /cart is requested");
    const bodyData = req.body;
    try {
        if (req.body.username == null) {
            console.log("Fail in null");
            return res.json({ messageAddCart: "fail" });
        }
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 ดังนั้นต้องบวก 1
        const day = String(now.getDate()).padStart(2, '0');
        const currentDate = `${year}${month}${day}`;

        let i = 0;
        let theId = ''
        let existsResult = []
        do {
            i++
            theId = `${currentDate}${String(i).padStart(4, '0')}`
            existsResult = await database.query({
                text: 'SELECT EXISTS (SELECT * FROM carts WHERE "bookId" = $1) ',
                values: [theId]
            })
        }
        while (existsResult.rows[0].exists)


        const result = await database.query({
            text: `INSERT INTO carts("bookId","username", "bookCreateDate") VALUES ($1, $2, $3)`,
            values: [theId,req.body.username, currentDate],
        });
        console.log("success");
        return res.json({ messageAddCart: "success" });
    } catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageAddCart: "fail" });
    }
}

export async function addReservation(req, res) {
    console.log("POST /reservation is requested");
    const bodyData = req.body;
    let roomStatus = null;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 ดังนั้นต้องบวก 1
    const day = String(now.getDate()).padStart(2, '0');
    const currentDate = `${year}${month}${day}`;
    const formattedDate = now.toISOString().slice(0, 10);
    console.log(formattedDate);
    // console.log(req.body.checkInDate);
    
    try {
        
        if(new Date(req.body.checkInDate) < new Date(formattedDate) || new Date(req.body.checkInDate) >= new Date(req.body.checkOutDate) || new Date(req.body.checkOutDate) <= new Date(formattedDate)) {
            console.log("Fail in checkDate");
            console.log(req.body);
            
            return res.json({ messageAddReservation: "fail in date" });
        }

        if (req.body.username == null || req.body.roomId == null || req.body.checkInDate == null || req.body.checkOutDate == null) {
            console.log("Fail in null");
            console.log(req.body);
            return res.json({ messageAddReservation: "fail in data" });
        }

        console.log("Before Exists");
        const existsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM reservations WHERE "roomId" = $1 
            AND ($2 BETWEEN reservations."checkInDate" AND reservations."checkOutDate" OR $3 BETWEEN reservations."checkInDate" AND reservations."checkOutDate"))`,
            values: [
                req.body.roomId,
                req.body.checkInDate,
                req.body.checkOutDate
            ],
        });
        if (existsResult.rows[0].exists) {
            console.log("Fail in exists");
            return res.json({ messageAddReservation: "fail in exists" });
        }
        console.log("After Exists");
        
        let i = 0;
        let theId = ''
        let existsResult2 = []
        do {
            i++
            theId = `${currentDate}${String(i).padStart(4, '0')}`
            existsResult2 = await database.query({
                text: 'SELECT EXISTS (SELECT "bookId" FROM carts WHERE "bookId" = $1) ',
                values: [theId]
            })
        }
        while (existsResult2.rows[0].exists)

        const bookTable = await database.query({
            text: `INSERT INTO carts("bookId","username", "bookCreateDate") VALUES ($1, $2, $3)`,
            values: [theId,req.body.username, currentDate],
        });
        
        roomStatus = "Full";
        const reservationTable = await database.query({
            text: `INSERT INTO reservations("bookId","roomId","checkInDate","checkOutDate","roomStatus","totalDay","totalPrice") 
                VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            values: [
                theId,
                req.body.roomId,
                req.body.checkInDate,
                req.body.checkOutDate,
                roomStatus ,
                req.body.totalDay,
                req.body.totalPrice
            ]
        });
        console.log("success");
        return res.json({ messageAddReservation: "success" });

    }catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageAddReservation: "fail" });
    }
}

export async function getReservation(req, res) {
    console.log("GET /reservation is requested");
    try {
        const result = await database.query({
            text: `SELECT rs."bookId" ,rs."roomId" , rt."roomName" , rooms."floor" , rooms."roomSize" , rs."checkInDate" , rs."checkOutDate" , rs."totalDay" , rs."totalPrice" FROM reservations rs 
                LEFT JOIN carts ct ON rs."bookId" = ct."bookId"
                LEFT JOIN rooms ON rs."roomId" = rooms."roomId"
                LEFT JOIN "roomTypes" rt ON rooms."roomType" = rt."roomType"
                WHERE ct."username" = $1`,
            values: [req.params.username],
        });
        
        console.log("success");
        return res.json(result.rows);
    } catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageGetReservation: "fail" });
    }
}

export async function deleteReservation(req, res) {
    console.log("DELETE /reservation is requested");
    try {

        const existsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM carts WHERE "bookId" = $1)`,
            values: [req.params.bookId],
        });
        if (!existsResult.rows[0].exists) {
            console.log("fail in exists");
            return res.json({ messageDeleteReservation: "fail" });
        }

        const result = await database.query({
            text: `DELETE FROM carts WHERE "bookId" = $1`,
            values: [req.params.bookId],
        });
        console.log("success");
        return res.json({ messageDeleteReservation: "success" });
    } catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageDeleteReservation: "fail" });
    }
}