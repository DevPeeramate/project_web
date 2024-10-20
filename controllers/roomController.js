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
    const roomData = ["earthRoomId","floor", "roomName", "roomSize" ,"roomDescription","roomPrice","roomStatus"];
    try {
        for (let i = 0; i < roomData.length; i++) {
            if(req.body[roomData[i]] == null){
                return res.json({messageAddRoom: `fail`});
            }
        }
        const existsResult = await database.query({
            text:`SELECT EXISTS (SELECT * FROM earthrooms WHERE "earthRoomId" = $1)`,
            values:[req.body.earthRoomId]
        })
        if(existsResult.rows[0].exists){ 
            return res.json({messageAddRoom: `fail`});
        }
        const result = await database.query({
            text:`INSERT INTO earthrooms("earthRoomId","floor","roomName","roomSize","roomDescription","roomPrice","roomStatus")
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            values:[
                req.body.earthRoomId, 
                req.body.floor, 
                req.body.roomName, 
                req.body.roomSize, 
                req.body.roomDescription,
                req.body.roomPrice,
                req.body.roomStatus
            ]
        })
        const datetime = new Date();
        bodyData.createDate = datetime;
        return res.json({messageAddRoom: `success`});
    } catch (error) {
        return res.json({messageAddRoom: `fail`});
    }       
}

export async function putRoom(req, res) {
    console.log("PUT /room is requested");
    const bodyData = req.body;
    console.log(req.body);
    const roomData = ["roomName", "roomSize" ,"roomDescription","roomPrice","roomStatus"];
    try {
        for (let i = 0; i < roomData.length; i++) {
            if(req.body.roomName != null && req.body.roomSize != null && room) {
                const result = await database.query({
                    text:`UPDATE earthrooms SET 
                    "roomName" = $1, 
                    "roomSize" = $2, 
                    "roomDescription" = $3 ,
                    "roomPrice" = $4,
                    "roomStatus" = $5
                    WHERE "earthRoomId" = $6`,
                    values:[
                        req.body.roomName, 
                        req.body.roomSize, 
                        req.body.roomDescription,
                        req.body.roomPrice,
                        req.body.roomStatus, 
                        req.params.id
                    ]
                })
                const datetime = new Date();
                bodyData.updateDate = datetime;
                console.log("success");
                return res.json({messagePutRoom: `success`});
            }
            else {
                return res.json({messagePutRoom: `fail`});
            }
        }
        
    } catch (error) {
        return res.json({messagePutRoom: `fail`});
    }
    
}

export async function getSearchRoom(req, res) {
    console.log("GET /searchroom is requested");

    try {
        const result = await database.query({
            text:`SELECT * FROM earthrooms WHERE "earthRoomId" ILIKE $1 OR "roomName" ILIKE $2`,
            values:[`%${req.body.earthRoomId}%`, `%${req.body.roomName}%`]
        })
        res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export async function getRoomById(req, res) {
    console.log("GET /room/:id is requested");

    try {
        if(!req.params.id){   
            const result = await database.query({
                text:`SELECT * FROM earthrooms`
            })
            res.status(200).json(result.rows);
        }
        else{
            const result = await database.query({
                text:`SELECT * FROM earthrooms WHERE "earthRoomId" = $1`,
                values:[req.params.id]
            })
            res.status(200).json(result.rows);
        }
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export async function getAllRoom(req, res) {  
    console.log("GET /AllRoom is requested");

    try {
        const result = await database.query({
            text:`SELECT * FROM earthrooms`
        })
        res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

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
    