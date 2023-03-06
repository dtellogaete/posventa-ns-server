const express = require('express');
const db = require('./config/db')
const cors = require('cors')

const app = express();

const  PORT = 3002;
app.use(cors());
app.use(express.json())

// Route to get all software
app.get("/api/software", (req,res)=>{
db.query("SELECT * FROM software", (err,result)=>{
    if(err) {
    console.log(err)
    } 
res.send(result)
}
    );   
});

// Route to get all software max customer
app.get("/api/maxcustomer", (req,res)=>{
    db.query("SELECT max(idcustomer) as datamax from cliente", (err,result)=>{
        if(err) {
        console.log(err)
        } 
    res.send(result)
    }
        );   
});

// Route to get all software max customer
app.get("/api/maxvals", (req,res)=>{
    db.query("SELECT max(idvals) as datamax from validations", (err,result)=>{
        if(err) {
        console.log(err)
        } 
    res.send(result)
    }
        );   
});

// Route to get all software max customer
app.get("/api/tabledata", (req,res)=>{
    query = "SELECT services.idservices, cliente.name as cliente, cliente.contact, software.name, services.kind, services.folio, services.date, services.service, services.work  FROM services INNER JOIN cliente ON cliente.idcustomer = services.idcustomer INNER JOIN software ON software.idsoft = services.idsoft";
    db.query(query, (err,result)=>{
        if(err) {
        console.log(err)
        } 
    res.send(result)
    }
        );   
});



// Route to get one post
app.get("/api/getFromId/:id", (req,res)=>{

const id = req.params.id;
    db.query("SELECT * FROM posts WHERE id = ?", id, (err,result)=>{
        if(err) {
        console.log(err)
        } 
    res.send(result)
    }
    );   
    });

// Route for creating the post
app.post('/api/create', (req,res)=> {

const username = req.body.name;
const title = req.body.title;
const text = req.body.text;

db.query("INSERT INTO posts (title, post_text, user_name) VALUES (?,?,?)",[title,text,username], (err,result)=>{
   if(err) {
       console.log(err)
   } 
   console.log(result)
}
);   
})

// Select tipo de soft

app.get("/api/softid/:idsoft", (req,res)=>{

    const id = req.params.idsoft;
        db.query("SELECT name FROM software WHERE idsoft = ?", [id], (err,result)=>{
            if(err) {
            console.log(err)
            } 
        res.send(result)
        }
        );   
});

// Select tipo de capacitacion


app.get("/api/capacitacionpdf/:idservice", (req,res)=>{

    const id = req.params.idservice;
        query=`SELECT services.work as work, software.name as soft, cliente.phone as phone, cliente.address as address, cliente.contact as contact, cliente.email as email, services.kind, services.service as service, services.folio as folio FROM services INNER JOIN cliente ON cliente.idcustomer = services.idcustomer INNER JOIN software ON software.idsoft = services.idsoft  where services.idservices = ? and services.kind = 'Capacitación'`
        db.query(query, [id], (err,result)=>{
            if(err) {
            console.log(err)
            } 
        res.send(result)
        }
        );   
});

app.get("/api/servicepdf/:idservice", (req,res)=>{

    const id = req.params.idservice;
        query=`SELECT services.work as work,
            software.name as soft,
            cliente.phone as phone, cliente.address as address, cliente.contact as contact, cliente.email as email,
            services.kind, services.service as service, services.folio as folio,
            validations.qequipment, validations.qlogo, validations.qreq, validations.qcsd, validations.qnode, validations.qnotification
            FROM services 
            INNER JOIN cliente ON cliente.idcustomer = services.idcustomer 
            INNER JOIN software ON software.idsoft = services.idsoft
            INNER JOIN validations ON services.idvals = validations.idvals
            WHERE services.idservices = ?;`
        db.query(query, [id], (err,result)=>{
            if(err) {
            console.log(err)
            } 
        res.send(result)
        }
        );   
});

app.get("/api/servicevalspdf/:idservice", (req,res)=>{

    const id = req.params.idservice;
        query=`SELECT
        validations.cserver_processor, validations.cserver_ram, validations.cserver_memory, validations.cserver_os, validations.cserver_internet,
        validations.cstation_processor, validations.cstation_ram, validations.cstation_memory, validations.cstation_os
        FROM services 
        INNER JOIN cliente ON cliente.idcustomer = services.idcustomer 
        INNER JOIN software ON software.idsoft = services.idsoft
        INNER JOIN validations ON services.idvals = validations.idvals
        WHERE services.idservices = ?;`
        db.query(query, [id], (err,result)=>{
            if(err) {
            console.log(err)
            } 
        res.send(result)
        }
        );   
});

// Route for creating the post
app.post('/api/service', (req,res)=> {

const service = req.body.service;
const work = req.body.work;
const kind = req.body.kind;
const folio = req.body.folio; 
const idsoft = req.body.idsoft;
const idvals = req.body.idvals;
const idcustomer = req.body.idcustomer;

db.query("INSERT INTO services (service, work, kind, folio, idsoft, idvals, idcustomer) VALUES (?,?,?,?,?,?,?)",
    [service, work, kind, folio, idsoft, idvals, idcustomer ], (err,result)=>{
    if(err) {
       
        console.log(err)
    } 
    console.log(result)
}
);   
})


// Route for creating the post
app.post('/api/servicecap', (req,res)=> {

    const service = req.body.service;
    const work = req.body.work;    
    const kind = req.body.kind;
    const folio = req.body.folio; 
    const idsoft = req.body.idsoft;    
    const idcustomer = req.body.idcustomer;
    
    db.query("INSERT INTO services (service, work, kind, folio, idsoft, idcustomer) VALUES (?,?,?,?,?,?)",
        [service, work, kind, folio, idsoft, idcustomer ], (err,result)=>{
        if(err) {
            console.log("error")
            console.log(err)
        } 
        console.log(result)
    }
    );   
    })

// Route for creating the post cliente
app.post('/api/cliente', (req,res)=> {

    const name = req.body.name;
    const contact = req.body.contact;    
    const address = req.body.address;
    const phone = req.body.phone;
    const email = req.body.email;      
    
    console.log(name, email)
    
    db.query("INSERT INTO cliente (name, contact, address, phone, email) VALUES (?,?,?,?,?)",
        [name, contact, address, phone, email], (err,result)=>{
        if(err) {
            console.log(err)
        } 
        console.log(result)
        }
    );   
})

// Route for creating the post validaciones
app.post('/api/val', (req,res)=> {

    const qEquipment = req.body.qEquipment;
    const qLogo = req.body.qLogo;
    const qReq = req.body.qReq;
    const qCSD = req.body.qCSD;
    const qNode = req.body.qNode;
    const qNotification = req.body.qNotification;
    const cserver_processor = req.body.cserver_processor;
    const cserver_ram = req.body.cserver_ram;
    const cserver_memory = req.body.cserver_memory;
    const cserver_os = req.body.cserver_os;
    const cserver_internet = req.body.cserver_internet;
    const cstation_processor = req.body.cstation_processor;
    const cstation_ram = req.body.cstation_ram;
    const cstation_memory = req.body.cstation_memory;
    const cstation_os = req.body.cstation_os;    
    
    db.query("INSERT INTO validations (qEquipment, qLogo, qReq, qCSD, qNode, qNotification, cserver_processor, cserver_ram, cserver_memory, cserver_os, cserver_internet,  cstation_processor,  cstation_ram,  cstation_memory,  cstation_os) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [qEquipment, qLogo, qReq, qCSD, qNode, qNotification,cserver_processor, cserver_ram, cserver_memory, cserver_os, cserver_internet,  cstation_processor,  cstation_ram,  cstation_memory,  cstation_os ], (err,result)=>{
    if(err) {
        console.log(err)
    } 
    console.log(result)
    }
    );   
})

// Select ultimo id

// Route for like
app.post('/api/like/:id',(req,res)=>{

const id = req.params.id;
db.query("UPDATE posts SET likes = likes + 1 WHERE id = ?",id, (err,result)=>{
    if(err) {
    console.log(err)
    } 
    console.log(result)
    }
    );    
});

// Route to delete a post

app.delete('/api/delete/:id',(req,res)=>{
    const id = req.params.id;

db.query("DELETE FROM posts WHERE id= ?", id, (err,result)=>{
if(err) {
console.log(err)
        } 
})
})


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})