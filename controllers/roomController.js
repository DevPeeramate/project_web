import database from "../service/database.js";

export async function addRoom(req, res) {
    console.log("POST /room is requested");
    const bodyData = req.body;
    const roomData = ["earthRoomId","floor", "roomName", "roomSize" ];
    try {
        for (let i = 0; i < roomData.length; i++) {
            if(req.body[roomData[i]] == null){
                return res.status(422).json({error: `${roomData[i]} is required`});
            }
        }
        const existsResult = await database.query({
            text:`SELECT EXISTS (SELECT * FROM earthrooms WHERE "earthRoomId" = $1)`,
            values:[req.body.earthRoomId]
        })
        if(existsResult.rows[0].exists){ 
            return res.status(409).json({error: `earthRoomId ${req.body.earthRoomId} is already exists`});
        }
        const result = await database.query({
            text:`INSERT INTO earthrooms("earthRoomId","floor","roomName","roomSize","roomDescription")
            VALUES ($1,$2,$3,$4,$5)`,
            values:[
                req.body.earthRoomId, 
                req.body.floor, 
                req.body.roomName, 
                req.body.roomSize, 
                req.body.roomDescription
            ]
        })
        const datetime = new Date();
        bodyData.createDate = datetime;
        res.status(201).json(bodyData);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }       
}