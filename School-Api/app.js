const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const url = require('url').parse(req.url, true);    
    console.log('url : ',url)
    if(url.pathname == '/school'){
        if(req.method == 'POST'){
            let body = '';
            req.on('data', function (data) {
                body += data;                            
            });
            req.on('end', function () {
                const json =JSON.parse(body);
                const school = new School(json.name, json.address, json.type);
                let schoolArrays = [school];
                let newDb;
                fs.readFile('database.json', 'utf8', function(err, data) {                
                    if(data){
                        let originDb = JSON.parse(data);
                        console.log('originDb : ',originDb)
                        //점 표기법으로 school을 불러옵니다.
                        let originSchoolObj = originDb.school
                        let arrayDb = Array.from(originSchoolObj);
                        arrayDb.push(school);
                        originDb.school = arrayDb;      

                        console.log('originDb : ',originDb)   
                        newDb = JSON.stringify(originDb)                                                             
                    } else {
                        // no data exists                      
                        newDb = JSON.stringify({school: schoolArrays});
                    }

                    fs.writeFile('database.json', newDb, 'utf8', function(err) {
                        res.statusCode = 201;
                        res.end(JSON.stringify({result : true, list : newDb}))
                    });
                });            
            });

        } else if(req.method == 'PUT'){
            let body = '';
            req.on('data', function (data) {
                body += data;            
            });
            req.on('end', function () {
                const json =JSON.parse(body);
                const school = new School(json.name, json.address, json.type);
                fs.readFile('database.json', 'utf8', function(err, data) {                
                    let originDb = JSON.parse(data);   
                    let originSchoolObj = originDb.school     
                    let arrayDb = Array.from(originSchoolObj);
                    arrayDb[json.index]  = school;
                    originDb.school = arrayDb;            
                    let newDb = JSON.stringify(originDb)             
                    fs.writeFile('database.json', newDb, 'utf8', function(err) {
                        res.statusCode = 201;
                        res.end(JSON.stringify({result : true, list : arrayDb}))
                    });
                });
            });   
        } else if(req.method == 'DELETE'){
            let body = '';
            req.on('data', function (data) {
                body += data;            
            });
            req.on('end', function () {
                const json =JSON.parse(body);
                fs.readFile('database.json', 'utf8', function(err, data) {                
                    let originDb = JSON.parse(data);                    
                    let originSchoolObj = originDb.school                 
                    let arrayDb = Array.from(originSchoolObj);
                    delete arrayDb[json.index] 
                    arrayDb = arrayDb.filter(x => x != null)   
                    originDb.school = arrayDb;            
                    let newDb = JSON.stringify(originDb)
                    fs.writeFile('database.json', newDb, 'utf8', function(err) {
                        res.statusCode = 201;
                        res.end(JSON.stringify({result : true, list : arrayDb}))
                    });
                });
            });   
        } else {                    
            res.statusCode = 200;
            // res.end('Hello World\n');
            fs.readFile('database.json', 'utf8', function(err, data) {                
                res.end(JSON.stringify({result : true, list : data}))
            });


        }


    } else if (url.pathname.includes('/student')){

        if(req.method == 'POST'){
            console.log("post called")  
            if(url.pathname == '/student/signin'){
                let body = '';
                req.on('data', function (data) {
                    body += data;            
                });
                req.on('end', function () {
                    const jsosn =JSON.parse(body);
                    fs.readFile('database.json', 'utf8', function(err, data) {                
                        if(data){
                            const json =JSON.parse(body);
                            let originDb = JSON.parse(data);
                            let originStduentDb = originDb.student;               
                            //우선 기존에 학생 데이터가 있는 지를 if 문으로 체크합니다.
                            if(originStduentDb){
                                let arrayDb = Array.from(originStduentDb);
                                for(let i=0;i<arrayDb.length;i++){
                                    let student = arrayDb[i];
                                    if(json.id == student.id && json.pwd == student.pwd){                                   
                                        res.end(JSON.stringify({login : true}))
                                        break;
                                    } else {
                                        console.log('no shool with that name ')
                                    }
                                    res.end(JSON.stringify({login : false}))
                                }
                            } else {
                                //학생 데이터가 없다면 로그인에 실패합니다.
                                //no student exists
                                res.end(JSON.stringify({login : false}))
                            }                         
                        }
                    });            
                });
            } else {
                let body = '';
                req.on('data', function (data) {
                    body += data;            
                });
                req.on('end', function () {
                    const json =JSON.parse(body);
                    const student = new Student(json.name, json.id, json.pwd, json.school);
                    //입력하려는 학생 객체를 class를 이용해서 만들었습니다.
                    let studentArrays = [];
                    let newDb;
                    fs.readFile('database.json', 'utf8', function(err, data) {                
                        if(data){
                            let originDb = JSON.parse(data);
                            let originSchoolDb = originDb.school;     
                            let originStduentDb = originDb.student;   
                            let schoolArrayDb = Array.from(originSchoolDb);
                            //기존에 student database가 존재하는 지 확인합니다.          
                            if(originStduentDb){
                                studentArrays = Array.from(originStduentDb)
                                //기존 학교 데이터를 가져 옵니다.
                                if(schoolArrayDb.length > 0){
                                    for(let i=0;i<schoolArrayDb.length;i++){
                                        let school = schoolArrayDb[i];
                                        //이미 데이터에 존재하는 학교인지를 if 문을 통해 체크 합니다.
                                        if(school.name == student.school){          
                                            studentArrays.push(student);
                                            //학생 목록을 변경한 array로 바꾸어 줍니다.
                                            originDb.student = studentArrays
                                            newDb = JSON.stringify(originDb);
                                            fs.writeFile('database.json', newDb, 'utf8', function(err) {
                                                res.statusCode = 201;
                                                res.end(JSON.stringify({result : true, list : newDb}))
                                            });
                                            break;
                                        } else {
                                            if(i == (schoolArrayDb.length-1)){
                                                res.statusCode = 404;
                                                // 404 : data not found
                                                res.end(JSON.stringify({result : false}))                                            
                                            }
                                        }
                                    }
                                } else {
                                    //학교 데이터가 없기 때문에 학생 데이터를 입력할 수 없습니다.
                                    res.statusCode = 404;
                                    // 404 : data not found
                                    res.end(JSON.stringify({result : false}))                                    
                                }

                            } else {
                                // student no existt
                                if(schoolArrayDb.length > 0){
                                    for(let i=0;i<schoolArrayDb.length;i++){
                                        let school = schoolArrayDb[i];
                                        //이미 데이터에 존재하는 학교인지를 if 문을 통해 체크 합니다.
                                        if(school.name == student.school){ 
                                            studentArrays.push(student);  
                                            originDb.student = studentArrays     
                                            newDb = JSON.stringify(originDb);
                                            fs.writeFile('database.json', newDb, 'utf8', function(err) {
                                                res.statusCode = 201;
                                                res.end(JSON.stringify({result : true, list : newDb}))
                                            });
                                            break;
                                        } else {
                                            if(i == (schoolArrayDb.length-1)){
                                                res.statusCode = 404;
                                                // 404 : data not found
                                                res.end(JSON.stringify({result : false}))                                            
                                            }
                                        } 
                                    }
                                } else {
                                    //학교 데이터가 없기 때문에 학생 데이터를 입력할 수 없습니다.
                                    res.statusCode = 404;
                                    // 404 : data not found
                                    res.end(JSON.stringify({result : false}))                                    
                                }

                            }                         
                        }
                    });            
                });
            }      


        } else if(req.method == 'PUT'){
            let body = '';
            req.on('data', function (data) {
                body += data;            
            });
            req.on('end', function () {
                const json =JSON.parse(body);
                const student = new Student(json.name, json.id, json.pwd, json.school);
                fs.readFile('database.json', 'utf8', function(err, data) {                
                    let originDb = JSON.parse(data);                    
                    let originSchoolDb = originDb.school;     
                    let originStduentDb = originDb.student;   
                    let schoolArrayDb = Array.from(originSchoolDb);              
                    if(originStduentDb){
                        studentArrays = Array.from(originStduentDb)
                        //기존 학교 데이터를 가져 옵니다.
                        if(schoolArrayDb.length > 0){
                            for(let i=0;i<schoolArrayDb.length;i++){
                                let school = schoolArrayDb[i];
                                //이미 데이터에 존재하는 학교인지를 if 문을 통해 체크 합니다.
                                if(school.name == student.school){          
                                    //학생 목록을 변경한 array로 바꾸어 줍니다.
                                    studentArrays[json.index]  = student;     
                                    originDb.student = studentArrays
                                    newDb = JSON.stringify(originDb);
                                    fs.writeFile('database.json', newDb, 'utf8', function(err) {
                                        res.statusCode = 201;
                                        res.end(JSON.stringify({result : true, list : newDb}))
                                    });
                                    break;
                                } else {
                                    if(i == (schoolArrayDb.length-1)){
                                        res.statusCode = 404;
                                        // 404 : data not found
                                        res.end(JSON.stringify({result : false}))                                            
                                    }
                                } 
                            }
                        } else {
                            //학교 데이터가 없기 때문에 학생 데이터를 입력할 수 없습니다.
                            res.statusCode = 404;
                            // 404 : data not found
                            res.end(JSON.stringify({result : false}))                                    
                        }
                    }
                });
            });   
        } else if(req.method == 'DELETE'){
            let body = '';
            req.on('data', function (data) {
                body += data;            
            });
            req.on('end', function () {
                const json =JSON.parse(body);
                fs.readFile('database.json', 'utf8', function(err, data) {                
                    let originDb = JSON.parse(data);                    
                    let originStduentDb = originDb.student;               
                    if(originStduentDb){
                        let arrayDb = Array.from(originStduentDb); //메서드 검색
                        delete arrayDb[json.index] 

                        arrayDb = arrayDb.filter(x => x != null)          
                        originDb.student = arrayDb
                        fs.writeFile('database.json', JSON.stringify(originDb), 'utf8', function(err) {
                            res.statusCode = 201;
                            res.end(JSON.stringify({result : true, list : originDb}))
                        });
                    }
                });
            });   
        } else {      
            let user = url.query.user; //localhost:3000/student?user=(이름)
            console.log('user : ',user)
            res.statusCode = 200;
            // res.end('Hello World\n');
            fs.readFile('database.json', 'utf8', function(err, data) {                
                let originDb = JSON.parse(data);             
                let originStduentDb = originDb.student; 
                let originSchoolDb = originDb.school;
                if(originStduentDb){
                    let stduentArrayDb = Array.from(originStduentDb);
                    console.log('stduentArrayDb : ',stduentArrayDb)
                    let schoolArray = Array.from(originSchoolDb);
                    console.log('schoolArray : ',schoolArray)
                    for(let i =0;i<stduentArrayDb.length;i++){
                        let studentItemName = stduentArrayDb[i].name;
                        console.log('studentItemName :',studentItemName)
                        console.log('user :',user)
                        if(studentItemName== user){
                            let checkShool =  stduentArrayDb[i].school                          
                            for(let j=0;j<schoolArray.length;j++){
                                if(schoolArray[j].name == checkShool){
                                    res.end(JSON.stringify({result : true, student : stduentArrayDb[i], school:schoolArray[j]}))
                                    break;
                                }
                            }                            
                            // break;
                        }
                    }
                    res.statusCode = 404;
                    // 404 : data not found
                    res.end(JSON.stringify({result : false}))   
                }    

            });


        }
    }
    class School {
        constructor(name, address, type) {
            this.name = name;
            this.address = address;
            this.type = type;

        }        
    }  

    class Student {
        constructor(name, id, pwd, school) {
            this.name = name;
            this.id = id;
            this.pwd = pwd;
            this.school = school;
        }        
    }  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});