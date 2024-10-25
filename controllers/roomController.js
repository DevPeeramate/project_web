import database from "../service/database.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_room')
    },
    filename: function (req, file, cb) {
        const filename = `${req.params.id}.jpg`;
        cb(null, filename)
    }
})

const upload = multer({ storage: storage }).single('file');

export async function uploadRoomImage(req, res) {
    console.log(req.params.id);
    upload(req,res,(err) => {
        if(err){
            return res.json({messageUploadRoom: `fail`});
        }
        
        return res.json({messageUploadRoom: `success`});
    })
}
export async function addRoom(req, res) {
    console.log("POST /room is requested");
    const bodyData = req.body;
    const roomData = ["roomId","floor", "roomName", "roomSize" ,"roomPrice","roomDetail","roomStatus"];
    let existsResult2 = false;
    
    try {
        for (let i = 0; i < roomData.length; i++) {
            if(req.body[roomData[i]] == null){
                console.log("Fail in null");
                return res.json({messageAddRoom: `fail`});
            }
        }
        const existsResult = await database.query({
            text:`SELECT EXISTS (SELECT * FROM rooms WHERE "roomId" = $1)`,
            values:[req.body.roomId]
        })
        console.log("Before Exists");
        if(existsResult.rows[0].exists){ 
            console.log("Fail in exists");
            return res.json({messageAddRoom: `fail`});
        }

        do{
            existsResult2 = await database.query({
                text:`SELECT EXISTS (SELECT * FROM "roomTypes" WHERE "roomName" = $1)`,
                values:[req.body.roomName]
            })
            console.log("Before Exists 2");
            if(!existsResult2.rows[0].exists){ 
                console.log("IN in exists 2");
                await database.query({
                    text:`INSERT INTO "roomTypes"("roomName") VALUES ($1)`,
                    values:[req.body.roomName]
                })
            }
        }while(!existsResult2.rows[0].exists);

        const roomTypeId = await database.query({
            text:`SELECT "roomType" FROM "roomTypes" WHERE "roomName" = $1`, 
            values:[req.body.roomName]});

        const result = await database.query({
            text:`INSERT INTO rooms("roomId","floor","roomType","roomSize","roomDetail","roomPrice","roomStatus")
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            values:[
                req.body.roomId, 
                req.body.floor, 
                roomTypeId.rows[0].roomType,
                req.body.roomSize, 
                req.body.roomDetail,
                req.body.roomPrice,
                req.body.roomStatus
            ]
        })
        console.log("success");
        const datetime = new Date();
        bodyData.createDate = datetime;
        return res.json({messageAddRoom: `success`});
    } catch (error) {
        console.log("Error in catch",error);
        return res.json({messageAddRoom: `fail`});
    }       
}

export async function putRoom(req, res) {
    console.log("PUT /room is requested");
    const bodyData = req.body;
    console.log(req.body);
    const roomData = ["roomName", "roomSize" ,"roomPrice","roomDetail","roomStatus"];
    let existsResult2 = false;
    try {
        for (let i = 0; i < roomData.length; i++) {
            // console.log(req.body[roomData[i]]);
            if(req.body[roomData[i]] == null){
                console.log("Fail in null");
                // console.log(req.body[roomData[i]]);
                return res.json({messagePutRoom: `fail`});
            }
        }

        do{
            existsResult2 = await database.query({
                text:`SELECT EXISTS (SELECT * FROM "roomTypes" WHERE "roomName" = $1)`,
                values:[req.body.roomName]
            })
            console.log("Before Exists 2");
            if(!existsResult2.rows[0].exists){ 
                console.log("IN in exists 2");
                await database.query({
                    text:`INSERT INTO "roomTypes"("roomName") VALUES ($1)`,
                    values:[req.body.roomName]
                })
            }
        }while(!existsResult2.rows[0].exists);

        const roomTypeId = await database.query({
            text:`SELECT "roomType" FROM "roomTypes" WHERE "roomName" = $1`, 
            values:[req.body.roomName]});

        console.log("Before Update");
        const result = await database.query({
            text:`UPDATE rooms SET 
            "roomType" = $1, 
            "roomSize" = $2, 
            "roomPrice" = $3,
            "roomDetail" = $4 ,
            "roomStatus" = $5
            WHERE "roomId" = $6`,
            values:[
                roomTypeId.rows[0].roomType, 
                req.body.roomSize, 
                req.body.roomPrice,
                req.body.roomDetail,
                req.body.roomStatus, 
                req.params.id
            ]
        })
        const datetime = new Date();
        bodyData.updateDate = datetime;
        console.log("success");
        return res.json({messagePutRoom: `success`});
        // else {
        //     return res.json({messagePutRoom: `fail`});
        // }
        
    } catch (error) {
        console.log("Error in catch:",error);
        return res.json({messagePutRoom: `fail`});
    }
    
}

// ไม่ได้ใช้ ?
// For member
export async function searchRoom(req, res) {
    console.log("GET /searchroom is requested");

    try {
        const result = await database.query({
            text:`SELECT room."roomId",room."floor",roomT."roomName",room."roomSize",room."roomPrice",room."roomDetail",room."roomStatus"
                FROM "rooms" room LEFT JOIN "roomTypes" roomT ON room."roomType" = roomT."roomType"
                WHERE room."roomId" LIKE $1 OR roomT."roomName" ILIKE $1`,
            values:[`%${req.body.roomId}%`]
        })
        console.log("success");
        res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error in catch:",error);
        return res.status(500).json({error: error.message});
    }
}

export async function getRoomById(req, res) {
    console.log("GET /room/:id is requested");

    try {
        if(!req.params.id){   
            const result = await database.query({
                text:`SELECT room."roomId",room."floor",roomT."roomName",room."roomSize",room."roomPrice",room."roomDetail",room."roomStatus"
                FROM "rooms" room LEFT JOIN "roomTypes" roomT ON room."roomType" = roomT."roomType"`
            })
            res.status(200).json(result.rows);
        }
        else{
            const result = await database.query({
                text:`SELECT room."roomId",room."floor",roomT."roomName",room."roomSize",room."roomPrice",room."roomDetail",room."roomStatus"
                FROM "rooms" room LEFT JOIN "roomTypes" roomT ON room."roomType" = roomT."roomType"
                WHERE "roomId" = $1`,
                values:[req.params.id]
            })
            res.status(200).json(result.rows);
        }

        
    } catch (error) {
        console.log("Error in catch:",error);
        return res.status(500).json({error: error.message});
    }
}

// ไม่ได้ใช้ ?
export async function searchAllRoom(req, res) {  
    console.log("GET /AllRoom is requested");

    try {
        const result = await database.query({
            text:`SELECT room."roomId",room."floor",roomT."roomName",room."roomSize",room."roomPrice",room."roomDetail",room."roomStatus"
                FROM "rooms" room LEFT JOIN "roomTypes" roomT ON room."roomType" = roomT."roomType"`
        })
        console.log("success");
        res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error in catch:",error);
        return res.status(500).json({error: error.message});
    }
}
// ไม่ได้ใช้ ?
export async function PaginationRoom(req, res) {
    console.log("GET /PaginationRoom is requested");
    try{
        const result = await database.query({
            text:`SELECT * FROM earthrooms`
        })
        const numberPerPage = 2;
        const totalPage = Math.ceil(result.rows.length / numberPerPage);
        // console.log(Math.ceil(totalPage));
        const page = parseInt(req.params.page);
        if(page < 1 || !page || page > totalPage){
            return res.status(404).json({message: "Page not found"});
        }

        const start = (page - 1) * numberPerPage;
        const end = start + numberPerPage;  
        const resultData = result.rows.slice(start, end);
        res.status(200).json(resultData);
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
}
    