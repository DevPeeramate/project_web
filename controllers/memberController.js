import database from "../service/database.js";
import bcrypt from 'bcrypt';


export async function getSession(req, res) {
    console.log("GET /session is requested");
    console.log(req.session);
    const theData = {
        email: req.session.memEmail,
        name: req.session.memName,
        role: req.session.role
    }
    // console.log
    return res.json(theData);
}
export async function register(req, res) {
    console.log("POST /members is requested");
    const bodyData = req.body;

    try {
        if(req.body.memEmail == null || req.body.memName == null){
            return res.json({messageRegister:"fail"})
        }
        console.log("Error 1")
        const existsResult = await database.query({
            text:'SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)',
            values:[req.body.memEmail]
        })
        console.log("Error 2")
        if(existsResult.rows[0].exists){
            return res.json({messageRegister:"fail"})
        }
        console.log("Error 3")
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
        return res.json({messageRegister:"success"})
    }
    catch(err){
        console.log("Error 4");
        return res.json({messageRegister:"fail"})
    }
}

export async function login(req, res) {
    console.log("POST /login is requested");
    const bodyData = req.body;
    try{
        if(req.body.loginName == null || req.body.password == null){
            return res.json({messageLogin:"fail"});
        }

        const existsResult = await database.query({
            text:'SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)',
            values:[req.body.loginName]
        })

        if(!existsResult.rows[0].exists){
            return res.json({messageLogin:"fail"});
        }

        const result = await database.query({
            text:'SELECT * FROM members WHERE "memEmail" = $1',
            values:[req.body.loginName]
        });

        const loginOK = await bcrypt.compare(req.body.password, result.rows[0].passwordHash);

        if(loginOK){
            console.log("Correct");
            req.session.memEmail = result.rows[0].memEmail;
            req.session.memName = result.rows[0].memName;
            req.session.role = result.rows[0].role;
            return res.json({messageLogin:"success"});}
        else
            return res.json({messageLogin:"fail"});
    }
    catch(err){
        return res.json({messageLogin:err.message})
    }
}

export async function logout(req, res) {
    console.log("GET /logout is requested");

    try{
        req.session.destroy();
        res.clearCookie("connect.sid");
        return res.json({messageLogout:"success"});
    }
    catch(err){
        return res.json({messageLogout:"fail"});
    }
}