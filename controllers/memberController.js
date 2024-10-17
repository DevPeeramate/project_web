import database from "../service/database.js";
import bcrypt from 'bcrypt';

export async function register(req, res) {
    console.log("POST /members is requested");
    const bodyData = req.body;

    try {
        if(req.body.memEmail == null || req.body.memName == null){
            return res.status(422).json({
                error:"Email and Name is required"
            })
        }
        console.log("Error 1")
        const existsResult = await database.query({
            text:'SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)',
            values:[req.body.memEmail]
        })
        console.log("Error 2")
        if(existsResult.rows[0].exists){
            return res.status(409).json({
                error:`memEmail ${req.body.memEmail} is already exists`
            })
        }
        
        const thePassword = req.body.password;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(thePassword, saltRounds);
        
        const result = await database.query({
            text:`INSERT INTO members("memEmail","memName","passwordHash")
            VALUES ($1,$2,$3)`,
            values:[
                req.body.memEmail,
                req.body.memName,
                passwordHash
            ]
        })

        const datetime = new Date();
        bodyData.createDate = datetime;
        res.status(201).json(bodyData);
    }
    catch(err){
        return res.status(500).json({
            error:err.message
        })
    }
}

export async function login(req, res) {
    console.log("POST /login is requested");
    const bodyData = req.body;
    try{
        if(req.body.loginName == null || req.body.password == null){
            return res.json({error:"Email and Password is required"});
        }

        const existsResult = await database.query({
            text:'SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)',
            values:[req.body.loginName]
        })

        if(!existsResult.rows[0].exists){
            return res.json({messageLogin:"Login Fail!!!"});
        }

        const result = await database.query({
            text:'SELECT * FROM members WHERE "memEmail" = $1',
            values:[req.body.loginName]
        });

        const loginOK = await bcrypt.compare(req.body.password, result.rows[0].passwordHash);

        if(loginOK)
            return res.json({messageLogin:"Login Success!!!"});
        else
            return res.json({messageLogin:"Login Fail!!!"});
    }
    catch(err){
        return res.json({
            error:err.message
        })
    }
}
