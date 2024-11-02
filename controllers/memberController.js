import database from "../service/database.js";
import bcrypt from 'bcrypt';
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_mem')
    },
    filename: function (req, file, cb) {
        const filename = `${req.params.id}.jpg`;
        cb(null, filename)
    }
})

const upload = multer({ storage: storage }).single('file');

export async function uploadProfileImage(req, res) {
    console.log(req.params.id);
    const result = await database.query({
        text: `SELECT EXISTS (SELECT * FROM members WHERE "username" = $1)`,
        values: [req.params.id]
    })

    if (!result.rows[0].exists) {
        console.log("fail in exists");
        return res.json({ messageUploadProfile: `fail` });
    }

    upload(req,res,(err) => {
        if(err){
            return res.json({messageUploadProfile: `fail`});
        }
        
        return res.json({messageUploadProfile: `success`});
    })
}


export async function getSession(req, res) {
    console.log("GET /session is requested");
    console.log(req.session);
    const theData = {
        username: req.session.username,
        name: req.session.memName,
        role: req.session.role,
        gender: req.session.gender,
        email: req.session.email,
        phone: req.session.phone
    }
    // console.log
    return res.json(theData);
}
export async function register(req, res) {
    console.log("POST /members is requested");
    const bodyData = req.body;

    try {
        if (req.body.username == null || req.body.password == null || req.body.memName == null) {
            console.log("Fail in null");
            return res.json({ messageRegister: "fail" })
        }
        console.log("After Null")
        const existsResult = await database.query({
            text: 'SELECT EXISTS (SELECT * FROM members WHERE "username" = $1)',
            values: [req.body.username]
        })

        if (existsResult.rows[0].exists) {
            console.log("fail in exists");
            return res.json({ messageRegister: "fail" })
        }

        const thePassword = req.body.password;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(thePassword, saltRounds);

        console.log("Before Insert")
        const result = await database.query({
            text: `INSERT INTO members("username","passwordHash","memName","gender","email","phone")
            VALUES ($1,$2,$3,$4,$5,$6)`,
            values: [
                req.body.username,
                passwordHash,
                req.body.memName,
                req.body.gender,
                req.body.email,
                req.body.phone
            ]
        })
        console.log("After Insert")
        const datetime = new Date();
        bodyData.createDate = datetime;
        return res.json({ messageRegister: "success" })
    }
    catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageRegister: "fail" })
    }
}

export async function login(req, res) {
    console.log("POST /login is requested");
    const bodyData = req.body;

    try {
        if (req.body.loginName == null || req.body.password == null) {
            console.log("Fail in null");
            return res.json({ messageLogin: "fail" });
        }

        const existsResult = await database.query({
            text: 'SELECT EXISTS (SELECT * FROM members WHERE "username" = $1)',
            values: [req.body.loginName]
        })
        console.log("After Exists")

        if (!existsResult.rows[0].exists) {
            console.log("Fail in exists");
            return res.json({ messageLogin: "fail" });
        }

        console.log("Before Select")
        const result = await database.query({
            text: `SELECT users."username",users."passwordHash",users."memName",users."gender",users."email",users."phone",rid."role"
                FROM "members" users LEFT JOIN "roles" rid ON users."roleId" = rid."roleId"
                WHERE users."username" = $1`,
            values: [req.body.loginName]
        });
        console.log(result.rows);
        console.log("After Select")
        const loginOK = await bcrypt.compare(req.body.password, result.rows[0].passwordHash);

        if (loginOK) {
            console.log("Login OK");
            req.session.username = result.rows[0].username;
            req.session.memName = result.rows[0].memName;
            req.session.role = result.rows[0].role;
            req.session.gender = result.rows[0].gender;
            req.session.email = result.rows[0].email;
            req.session.phone = result.rows[0].phone;
            console.log(req.session);
            return res.json({ messageLogin: "success" });
        }
        else
            return res.json({ messageLogin: "fail" });
    }
    catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageLogin: err.message })
    }
}

export async function logout(req, res) {
    console.log("GET /logout is requested");

    try {
        req.session.destroy();
        res.clearCookie("connect.sid");
        return res.json({ messageLogout: "success" });
    }
    catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageLogout: "fail" });
    }
}

export async function deleteAccount(req, res) {
    console.log("GET /deleteAccount is requested");
    try {
        const existsResult = await database.query({
            text: 'SELECT EXISTS (SELECT * FROM members WHERE "username" = $1)',
            values: [req.params.username]
        })
        if (!existsResult.rows[0].exists) {
            console.log("Fail in exists");
            return res.json({ messageDeleteAccount: "fail" });
        }

        const result = await database.query({
            text: `DELETE FROM members WHERE "username" = $1`,
            values: [req.params.username]
        });
        req.session.destroy();
        res.clearCookie("connect.sid");
        console.log("Delete OK");
        return res.json({ messageDeleteAccount: "success" });
    }
    catch (err) {
        console.log("Error in catch", err);
        return res.json({ messageDeleteAccount: "fail" });
    }
}
