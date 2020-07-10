
import express, { Application, NextFunction, Request, Response } from 'express';
var cors = require('cors')
// const { createServer } = require('http')
const compression = require('compression')
const morgan = require('morgan')
const path = require('path')

const normalizePort: any = (port: any) => parseInt(port, 10)
const app: Application = express();
const dev = app.get('env') !== 'production'
let dbPath = "./database.js"
if (!dev) {
    dbPath = "../database.js"
    app.disable('x-powered-by')
    app.use(compression())
    app.use(morgan('common'))

    app.use(express.static(path.resolve(__dirname, 'build')))

    app.get("/", (req: Request, res: Response, next: NextFunction) => {

        res.sendfile(path.resolve(__dirname, 'build', 'index.html'))
    })
}
else app.use(morgan('dev'))
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var db = require(dbPath)
// const router: Router = express.Router();






app.get("/all", (req: Request, res: Response, next: NextFunction) => {
    // console.log('add(5,5)', add(5, 5))
    var sql = "select * from task"
    var params: Array<any> = []
    db.all(sql, params, (err: any, rows: any) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        // res.json({
        //     "message": "success",
        //     "data": rows
        // })
        res.send(rows)
    });

});

app.post("/:index/create", (req: Request, res: Response, next: NextFunction) => {
    // let index = Number(req.params.index);
    res.send("create")

});
app.post("/api/task/create", (req, res, next) => {
    var errors = []
    // if (!req.body.password){
    //     errors.push("No password specified");
    // }
    // if (!req.body.email){
    //     errors.push("No email specified");
    // }
    // if (errors.length){
    //     res.status(400).json({"error":errors.join(",")});
    //     return;
    // }
    var data = {
        content: req.body.name,
        date: req.body.date,
        username: req.body.username,
        tel: req.body.tel,
        email: req.body.email,
        // password : md5(req.body.password)
    }
    var sql = 'INSERT INTO task (content , date , username , tel , email ) VALUES (?,?,?,?,?)'
    var params = [
        data.content,
        data.date,
        data.username,
        data.tel,
        data.email
    ]
    db.run(sql, params, function (err: any, result: any) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})

// app.put("/api/task/:index/update", (req: Request, res: Response, next: NextFunction) => {
//     // let index = Number(req.params.index);
//     console.log(req.body)
//     res.send("update")

// });

app.put("/api/task/:index/update", (req, res: Response, next) => {
    var data = {
        content: req.body.content,
        date: req.body.date,
        email: req.body.email,
        tel: req.body.tel,
        username: req.body.username,
        index: req.params.index
    }
    db.run(
        `UPDATE task set content =  ? , email = ? ,  tel =  ?,  
        username = ?  WHERE id = ?`,
        [data.content, data.email, data.tel, data.username, data.index],
        function (err: any, result: any) {
            if (err) {
                res.status(400).json({ "error": res.statusMessage })
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
})

app.delete("/:id/delete", (req: Request, res: Response, next: NextFunction) => {
    // let index = Number(req.params.index);
    // res.send("delete")
    console.log("delete", req.params)
    db.run(
        'DELETE FROM task WHERE id = ?',
        req.params.id,
        function (err: any, result: any) {
            if (err) {
                res.status(400).json({ "error": res.statusMessage })
                return;
            }
            res.json({ "message": "deleted", changes: this.changes })
        });

});

app.get("/:index", (req: Request, res: Response, next: NextFunction) => {



    var sql = "select * from task where id = ?"
    var params = [req.params.index]

    db.all(sql, params, (err: any, row: any) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        res.send(row)
    });
});

app.listen(process.env.PORT || 5000, () => console.log('ServerRunning'))


app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params: Array<any> = []
    db.all(sql, params, (err: any, rows: any) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});


app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params: Array<any> = []
    db.all(sql, params, (err: any, rows: any) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});



app.get("/api/user/:id", (req: any, res: any, next) => {

    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.all(sql, params, (err: any, row: any) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

app.post("/api/task/", (req, res: any, next): any => {


    var sql = 'INSERT INTO task (username, email, user_id , content ,date, tel) VALUES ( ? , ? , ? , ? , ? , ?)'
    // var params = [title, email, user_id, content, date, tel]

    db.run(sql, ['amir task', 'amir@dkf.com', ' 1', ' cnoedas asd', '1220', '043-2234-232'], function (err: any, result: any) {

        if (err) {
            res.status(400).json({ "error": err })
            return;
        }
        console.log({ _this: this })
        res.json({
            "message": "success",
            "data": this.lastID

        })
    });
})