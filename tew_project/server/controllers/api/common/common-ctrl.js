"use strict";
const s3 = require("../../../components/s3");
const uuid = require("uuid/v4");
const config = require("../../../config");
const userHandler = require("../user/user-handler");
const db = require("../../../components/db");
const util = require("../../../components/util");
const handler = require("./file-handler");
const JWT = require("../../../libs/jwt/index");
var mime = require("mime-types");

//input -> 업로드 할 file
//output -> extension(파일 확장자명)
module.exports.getExtension = async (req, res, next) => {
  const { type } = req.query;
  let extension = mime.extension(type);
  if (type == "hwp") {
    extension = "hwp";
  }
  // console.log('extension : ',extension)
  res.status(200).json({ extension: extension });
};

//input -> mimetype, extension, filename
//output -> uploadUrl
module.exports.profileUploadUrl = async (req, res, next) => {
  try {
    console.log("getUserImageUrl : ", req.options);
    const { mimetype, extension, filename } = req.options;
    console.log("mimetype : ", mimetype);

    let path = `profile/${filename}.${extension}`; //경로 설정시 버킷내에 폴더 자동 생성

    const url = s3.generatePreSignedUrl({
      key: path,
      mimetype: mimetype
    });
    console.log("path :", path);
    // path = type === "chat" ? `${config.aws.s3.frontPath}/${path}` : path;
    res.status(200).json({ url, path });
  } catch (err) {
    next(err);
  }
};

//upload view
module.exports.uploadView = async (req, res, next) => {
  res.render("index", { title: "Express" });
};

// **중요 profileimg를 db에 등록은 profileUploadUrl을 통해 승인된 url을 받은 뒤  s3에 직접 저정된것이 확인되면 프론트에서 swagger에 있는
//uploadProfileImg 라우팅 경로를 사용해 직접 db에 저장하여야한다

// ** 수정은 db수정 라우팅 경로를 알려주면 프론트에서 알아서 해야함

// ** 그렇다면 수정, 삭제 했을 경우 s3에 저장된 파일은 어떻게 없애는가...!!!!
// -> 파일명 동일 덮어씌우기로 해결

//upload profileurl to database(profile_img)
//input -> header : token
//         body : path
module.exports.uploadProfileImg = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let user = await userHandler.getList({ idx: req.idx });
    const authorization = `Bearer ${user[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    const newProfile = req.options;
    newProfile.user_idx = req.idx;
    newProfile.register_date = util.getCurrentTime();
    newProfile.update_date = util.getCurrentTime();
    console.log("newProfile : ", newProfile);
    const result = await handler.uploadProfileImg(newProfile, connection);

    await db.commit(connection);
    res.status(200).json({ c: result });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

//get profileImg
//input -> header : token -> getlist idx
module.exports.getProfileImg = async (req, res, next) => {
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let user = await userHandler.getList({ idx: req.idx });
    const authorization = `Bearer ${user[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    const result = await handler.getProfileImg(req.idx);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//profileImg delete
//input -> header : token
module.exports.deleteProfileImg = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let user = await userHandler.getList({ idx: req.idx });
    const authorization = `Bearer ${user[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    const result = await handler.deleteProfileImg(
      { user_idx: req.idx },
      connection
    );
    await db.commit(connection);
    let returnValue = false;
    if (result.affectedRows === 1) {
      returnValue = true;
    }
    res.status(200).json({ result: returnValue });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

//update profileImg
//input ->header : token
//        body : path
module.exports.updateProfileImg = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let user = await userHandler.getList({ idx: req.idx });
    const authorization = `Bearer ${user[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    let newProfile = req.options;
    newProfile.user_idx = req.idx;
    newProfile.UPDATE_DATE = util.getCurrentTime(); //updatdate -> 현재시간
    console.log("profile : ", newProfile);
    const result = await handler.updateProfileImg(newProfile, connection);

    await db.commit(connection);
    res.status(200).json({ result: result });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};
