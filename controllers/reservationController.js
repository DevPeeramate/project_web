import database from "../service/database.js";


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
    
    try {
        
        if(req.body.checkInDate < formattedDate || req.body.checkInDate >= req.body.checkOutDate || req.body.checkOutDate <= formattedDate) {
            console.log("Fail in checkDate");
            return res.json({ messageAddReservation: "fail" });
        }

        if (req.body.roomId == null || req.body.username == null || req.body.checkInDate == null || req.body.checkOutDate == null) {
            console.log("Fail in null");
            console.log(req.body);
            return res.json({ messageAddReservation: "fail" });
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
            return res.json({ messageAddReservation: "fail" });
        }
        console.log("After Exists");
        
        let i = 0;
        let theId = ''
        let existsResult2 = []
        do {
            i++
            theId = `${currentDate}${String(i).padStart(4, '0')}`
            existsResult2 = await database.query({
                text: 'SELECT EXISTS (SELECT "bookId" FROM reservations WHERE "bookId" = $1) ',
                values: [theId]
            })
        }
        while (existsResult.rows[0].exists)

        roomStatus = "Full";
        const result = await database.query({
            text: `INSERT INTO reservations("bookId","roomId","username","checkInDate","checkOutDate","roomStatus","createDate") 
                VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            values: [
                theId,
                req.body.roomId,
                req.body.username,
                req.body.checkInDate,
                req.body.checkOutDate,
                roomStatus ,
                formattedDate
            ]
        });
        console.log("success");
        return res.json({ messageAddReservation: "success" });

    }catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageAddReservation: "fail" });
    }
}