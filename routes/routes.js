//routes/routes.js
const express = require("express");
const router = express.Router();
const User = require("../db/models/User");
const Workshop = require("../db/models/Workshop");
const Product = require("../db/models/Product");
const Review = require("../db/models/Review");
const Apply = require("../db/models/Apply");
const { CurrentTime, formatDateTime } = require("../db/Date");
const { SolapiMessageService } = require("solapi");

//솔라피 관련
const api_key = process.env.API_KEY || "";
const api_secret = process.env.API_SECRET || "";
const messageService = new SolapiMessageService(api_key, api_secret);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 고객 관련 api
 */

/**
 * @swagger
 * tags:
 *  name: Workshop
 *  description: 공방 관련 api
 */

/**
 * @swagger
 * tags:
 *  name: Product
 *  description: 하자품 관련 api
 */

/**
 * @swagger
 * tags:
 *  name: Review
 *  description: 리뷰 관련 api
 */

/**
 * @swagger
 * tags:
 *  name: Apply
 *  description: 신청 관련 api
 */

/**
 * @swagger
 * tags:
 *  name: API
 *  description: 기타 api
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: 모든 고객 데이터를 조회합니다.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 모든 고객 데이터의 리스트
 */
router.get("/user", async (req, res) => {
  try {
    const users = await User.find(); // Mongoose's .find() fetches all users
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Error fetching users" });
  }
});

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: 새로운 고객 데이터를 추가합니다.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: 추가된 고객 데이터
 */
router.post("/user", async (req, res) => {
  console.log(req.body);
  const { name, phone, address, id } = req.body;

  if (!name || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await User.insertUser(name, phone, address, id);
    return res.status(201).json({ message: "User inserted successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: "Error creating user" });
  }
});

/**
 * @swagger
 * /api/user/{name}:
 *   get:
 *     summary: 특정 이름의 고객 데이터를 조회합니다.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 고객의 이름.
 *     responses:
 *       200:
 *         description: 고객 데이터
 *       404:
 *         description: 고객 데이터를 찾을 수 없음
 */
router.get("/user/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const data = await User.find({ name: name });

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(data);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/user/{phone_number}:
 *  put:
 *     summary: 전화번호를 기반으로 기존 고객 데이터를 수정합니다.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: phone_number
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 고객의 전화번호. 숫자만 입력하세요.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 수정된 고객 데이터
 *       400:
 *         description: 잘못된 요청 (예시 - 필수 필드가 없음)
 *       404:
 *         description: 해당 전화번호의 고객을 찾을 수 없음
 */

router.put("/user/:phone_number", async (req, res) => {
  try {
    const phone_number = req.params.phone_number.toString();
    let user = await User.findOne({ phone: phone_number });

    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, address, deleted_at } = req.body;
    const time = await CurrentTime();
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.updated_at = time;
    user.deleted_at = deleted_at ? time : user.deleted_at;

    await user.save();

    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "error" });
  }
});

/**
 * @swagger
 * /api/workshop:
 *   get:
 *     summary: 모든 공방 데이터를 조회합니다.
 *     tags: [Workshop]
 *     responses:
 *       200:
 *         description: 모든 공방 데이터의 리스트
 */
router.get("/workshop", async (req, res) => {
  try {
    const workshops = await Workshop.find();
    return res.status(200).json(workshops);
  } catch (err) {
    console.error("Error fetching workshops:", err);
    return res.status(500).json({ message: "Error fetching workshops" });
  }
});

/**
 * @swagger
 * /api/workshop:
 *   post:
 *     summary: 새로운 공방 데이터를 추가합니다.
 *     tags: [Workshop]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workshop'
 *     responses:
 *       201:
 *         description: 추가된 공방 데이터
 */
router.post("/workshop", async (req, res) => {
  console.log(req.body);
  const { name, phone, address } = req.body;

  if (!name || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await Workshop.insertWorkshop(name, phone, address);
    return res.status(201).json({ message: "Workshop inserted successfully" });
  } catch (err) {
    console.error("Error creating workshop:", err);
    return res.status(500).json({ message: "Error creating workshop" });
  }
});

/**
 * @swagger
 * /api/workshop/{name}:
 *   get:
 *     summary: 특정 이름의 공방 데이터를 조회합니다.
 *     tags: [Workshop]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 공방의 이름.
 *     responses:
 *       200:
 *         description: 공방 데이터
 *       404:
 *         description: 공방 데이터를 찾을 수 없음
 */
router.get("/workshop/:name", async (req, res) => {
  try {
    const name = req.params.name.toString();
    const data = await Workshop.find({ name: name });

    if (!data) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    return res.json(data);
  } catch (err) {
    console.error("Error fetching workshop:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: 모든 하자품 데이터를 조회합니다.
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: 모든 하자품 데이터의 리스트
 */
router.get("/product", async (req, res) => {
  try {
    const products = await Product.find().populate("workshop", "name").exec();
    const updatedProducts = products.map((product) => ({
      ...product.toObject(),
      workshop: product.workshop.name,
    }));

    return res.status(200).json(updatedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
});

/**
 * @swagger
 * /api/product/desk:
 *   get:
 *     summary: 책상 항목의 하자품 데이터를 조회합니다.
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: 모든 책상 하자품 데이터의 리스트
 */
router.get("/product/desk", async (req, res) => {
  try {
    const products = await Product.find({ category: "desk" }).populate("workshop", "name").exec();
    const updatedProducts = products.map((product) => ({
      ...product.toObject(),
      workshop: product.workshop.name,
    }));
    return res.status(200).json(updatedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
});

/**
 * @swagger
 * /api/product/table:
 *   get:
 *     summary: 테이블 항목의 하자품 데이터를 조회합니다.
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: 모든 테이블 하자품 데이터의 리스트
 */
router.get("/product/table", async (req, res) => {
  try {
    const products = await Product.find({ category: "table" }).populate("workshop", "name").exec();
    const updatedProducts = products.map((product) => ({
      ...product.toObject(),
      workshop: product.workshop.name,
    }));
    return res.status(200).json(updatedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
});

/**
 * @swagger
 * /api/product/chair:
 *   get:
 *     summary: 의자 항목의 하자품 데이터를 조회합니다.
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: 모든 의자 하자품 데이터의 리스트
 */
router.get("/product/chair", async (req, res) => {
  try {
    const products = await Product.find({ category: "chair" }).populate("workshop", "name").exec();
    const updatedProducts = products.map((product) => ({
      ...product.toObject(),
      workshop: product.workshop.name,
    }));
    return res.status(200).json(updatedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
});

/**
 * @swagger
 * /api/product/expendables:
 *   get:
 *     summary: 소모품 항목의 하자품 데이터를 조회합니다.
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: 모든 소모품 데이터의 리스트
 */
router.get("/product/expendables", async (req, res) => {
  try {
    const products = await Product.find({ category: "expendables" }).populate("workshop", "name").exec();
    const updatedProducts = products.map((product) => ({
      ...product.toObject(),
      workshop: product.workshop.name,
    }));
    return res.status(200).json(updatedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
});

/**
 * @swagger
 * /api/product/etc:
 *   get:
 *     summary: 기타 항목의 하자품 데이터를 조회합니다.
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: 모든 기타 하자품 데이터의 리스트
 */
router.get("/product/etc", async (req, res) => {
  try {
    const products = await Product.find({ category: "etc" }).populate("workshop", "name").exec();
    const updatedProducts = products.map((product) => ({
      ...product.toObject(),
      workshop: product.workshop.name,
    }));
    return res.status(200).json(updatedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
});

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: 새로운 하자품 데이터를 추가합니다.
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: 추가된 하자품 데이터
 */
router.post("/product", async (req, res) => {
  //console.log(req.body);
  const { workshop, name, category, cost, price, size, reason, img } = req.body;

  if (!workshop || !name || !category || !cost || !size || !reason || !img) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await Product.insertProduct(workshop, name, category, cost, price, size, reason, img);
    return res.status(201).json({ message: "Product inserted successfully" });
  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({ message: "Error creating product" });
  }
});

/**
 * @swagger
 * /api/product/{id}:
 *  put:
 *     summary: id를 기반으로 하자품의 데이터를 수정합니다.
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: 수정된 하자품 데이터
 */

router.put("/product/:id", async (req, res) => {
  try {
    const id = req.params.id.toString();
    let product = await Product.findOne({ _id: id });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const { workshop, name, category, cost, price, size, reason, img, status } = req.body;
    product.workshop = workshop || product.workshop;
    product.name = name || product.name;
    product.category = category || product.category;
    product.cost = cost || product.cost;
    product.price = price || product.price;
    product.size = size || product.size;
    product.reason = reason || product.reason;
    product.img = img || product.img;
    product.status = status || product.status;

    await product.save();

    return res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "error" });
  }
});

/**
 * @swagger
 * /api/review:
 *   get:
 *     summary: 모든 리뷰 목록를 조회합니다.
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: 모든 리뷰 데이터의 리스트
 */
router.get("/review", async (req, res) => {
  try {
    console.log("리뷰 목록 조회");
    const reviews = await Review.find()
      .populate("user")
      .populate({ path: "product", populate: { path: "workshop" } })
      .exec();

    const updatedReviews = await reviews.map((review) => {
      return {
        _id: review._id,
        user: review.user.name,
        product: review.product.name,
        workshop: review.product.workshop.name,
        content: review.content,
        img: review.img,
      };
    });
    return res.status(200).json(updatedReviews);

    //const reviews = await Review.find();
    return res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return res.status(500).json({ message: "Error fetching reviews" });
  }
});

/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: 새로운 리뷰 데이터를 추가합니다.
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applyId:
 *                 type: string
 *                 description: "신청서 id값"
 *                 example: "673e9c5d3c176d103a4ed9b4"
 *               content:
 *                 type: string
 *                 description: "리뷰 내용"
 *                 example: "리뷰"
 *               img:
 *                 type: string
 *                 description: "이미지 경로"
 *                 example: "img.jpg"
 *     responses:
 *       201:
 *         description: 추가된 리뷰 데이터
 */
router.post("/review", async (req, res) => {
  console.log("리뷰 추가");
  const { applyId, content, img } = req.body;

  if (!applyId || !content || !img) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let apply = await Apply.findOne({ _id: applyId }).populate("user").populate("product");
  const user = apply.user._id;
  const product = apply.product._id;

  console.log(apply);
  console.log(user);
  console.log(product);

  try {
    await Review.insertReview(user, product, content, img);
    return res.status(201).json({ message: "Review inserted successfully" });
  } catch (err) {
    console.error("Error creating review:", err);
    return res.status(500).json({ message: "Error creating review" });
  }
});

/**
 * @swagger
 * /api/review/{name}:
 *   get:
 *     summary: 특정 고객이 게시한 리뷰 데이터를 조회합니다.
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 고객의 이름.
 *     responses:
 *       200:
 *         description: 리뷰 데이터
 *       404:
 *         description: 리뷰 데이터를 찾을 수 없음
 */
router.get("/review/:name", async (req, res) => {
  try {
    const name = req.params.name.toString();
    const reviews = await Review.find().populate("user").populate("product");
    const data = reviews.filter((review) => review.user.name === name);
    if (!data) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.json(reviews);
  } catch (err) {
    console.error("Error fetching review:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/review/{id}:
 *  put:
 *     summary: id를 기반으로 기존 리뷰 데이터를 수정합니다.
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 리뷰의 id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: 수정된 리뷰 데이터
 *       400:
 *         description: 잘못된 요청 (예시 - 필수 필드가 없음)
 *       404:
 *         description: 해당 id의 리뷰를 찾을 수 없음
 */

router.put("/review/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let review = await Review.findOne({ _id: id });

    if (!review) return res.status(404).json({ message: "Review not found" });

    const { user, product, workshop, content, img } = req.body;
    review.user = user || review.user;
    review.product = product || review.product;
    review.content = content || review.content;
    review.img = img || review.img;

    await review.save();

    return res.json(review);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "error" });
  }
});

/**
 * @swagger
 * /api/apply:
 *   get:
 *     summary: 모든 신청 목록를 조회합니다.
 *     tags: [Apply]
 *     responses:
 *       200:
 *         description: 모든 신청 데이터의 리스트
 */

router.get("/apply", async (req, res) => {
  try {
    const applys = await Apply.find().populate("user", "name").populate("product", "name").populate("workshop", "name");
    const updatedApplys = applys.map((apply) => ({
      ...apply.toObject(),
      user: apply.user ? apply.user.name : "null",
      product: apply.product ? apply.product.name : "null",
      workshop: apply.workshop ? apply.workshop.name : "null",
    }));
    return res.status(200).json(updatedApplys);
  } catch (err) {
    console.error("Error fetching applys:", err);
    return res.status(500).json({ message: "Error fetching applys" });
  }
});

/**
 * @swagger
 * /api/apply/{id}:
 *   get:
 *     summary: ID를 기반으로 특정 신청 데이터를 조회합니다.
 *     tags: [Apply]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 신청의 id.
 *     responses:
 *       200:
 *         description: 신청 데이터
 */

router.get("/apply/:id", async (req, res) => {
  try {
    console.log("id를 기반으로 apply 조회");
    const id = req.params.id.toString();
    const apply = await Apply.find({ _id: id }).populate("user").exec();
    return res.status(200).json(apply);
  } catch (err) {
    console.error("Error fetching applys:", err);
    return res.status(500).json({ message: "Error fetching applys" });
  }
});

/**
 * @swagger
 * /api/apply:
 *   post:
 *     summary: 새로운 신청 데이터를 추가하고 솔라피 문자를 전송합니다.
 *     tags: [Apply]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/API'
 *     responses:
 *       201:
 *         description: 추가된 리뷰 데이터
 */

router.post("/apply", async (req, res) => {
  console.log("접수신청");
  const { name, phone, address, detailedAddress, productId, disableSms } = req.body;
  //필드 비었는지 확인
  if (!name || !phone || !address || !detailedAddress || !productId) {
    console.log("필드 에러");
    return res.status(400).json({ message: "All fields are required" });
  }
  //고객정보 찾고, 없으면 생성
  let user = await User.findOne({ phone: phone });
  const address_ = `${address}, ${detailedAddress}`;
  console.log(user);
  if (!user) {
    user = await User.insertUser(name, phone, address_);
  } else if (user.name != name) {
    console.log("고객 전화번호와 이름 불일치.");
    return res.status(400).json({ message: "기존의 고객 전화번호와 이름이 일치하지 않습니다. 고객센터에 문의해주세요." });
  }
  //상품정보 찾고, 없으면 에러반환
  let product = await Product.findOne({ _id: productId });
  if (!product) {
    console.log("제품을 찾을 수 없습니다.");
    return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
  } else if (product.status === "나눔완료") {
    console.log("제품이 이미 나눔 완료된 제품입니다.");
    return res.status(410).json({ message: "제품이 이미 나눔 완료된 제품입니다." });
  }
  //공방정보 찾고, 없으면 에러반환
  let workshop = await Workshop.findOne({ _id: product.workshop });
  if (!workshop) {
    console.log("공방 정보를 찾을 수 없습니다.");
    return res.status(404).json({ message: "공방 정보를 찾을 수 없습니다." });
  }
  try {
    //신청 데이터 생성
    let apply = await Apply.insertApply(user._id, product._id, workshop._id, address_);

    //고객전송
    const date = await formatDateTime(apply.requested_at);
    const toUser = await messageService.send({
      to: phone,
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.SOLAPI_APPLY_USER,
        variables: {
          "#{name}": user.name || "",
          "#{date}": date || "",
          "#{workshop}": workshop.name || "",
          "#{product}": product.name || "",
          "#{price}": `${product.price}만원` || "",
          "#{LINK}": `13.236.93.243:8001/api/apply/cancelUser/${apply._id}`, //주문취소
          "#{LINK2}": `woodlink.netlify.app/Delivery/${apply._id}`, //배송지 변경
        },
        disableSms: disableSms || false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });

    //공방전송
    const toWorkshop = await messageService.send({
      to: workshop.phone,
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.SOLAPI_APPLY_WORKSHOP,
        variables: {
          "#{name}": user.name || "",
          "#{date}": date || "",
          "#{workshop}": workshop.name || "",
          "#{product}": product.name || "",
          "#{price}": `${product.price}만원` || "",
          "#{phone}": user.phone || "",
          "#{LINK}": `13.236.93.243:8001/api/apply/accept/${apply._id}`, //주문접수
        },
        disableSms: disableSms || false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });
    return res.status(200).json({ message: "Apply inserted successfully" });
  } catch (err) {
    console.error("Error creating apply:", err);
    return res.status(500).json({ message: "Error creating apply" });
  }
});

/**
 * @swagger
 * /api/apply/accept/{id}:
 *   get:
 *     summary: 해당 id를 가진 나눔 신청을 접수합니다.
 *     tags: [API]
 *     responses:
 *       200:
 *         description: 접수 완료됨
 */
router.get("/apply/accept/:id", async (req, res) => {
  try {
    console.log("접수요청");
    const id = req.params.id;
    let apply = await Apply.findOne({ _id: id }).populate("user").populate("workshop").populate("product").exec();
    let product = await Product.findOne({ _id: apply.product._id }).exec();
    if (apply.status === "접수됨") {
      apply.status = "접수완료";
      await apply.save();
      product.status = "나눔완료";
      await product.save();
    }
    console.log(apply.user.phone);
    //접수완료 문자
    const appected = await messageService.send({
      to: apply.user.phone,
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.SOLAPI_APPLY_ACCEPTED,
        variables: {
          "#{name}": apply.user.name || "",
          "#{date}": apply.requested_at || "",
          "#{workshop}": apply.workshop.name || "",
          "#{product}": apply.product.name || "",
          "#{price}": `${apply.product.price}만원` || "",
          "#{LINK}": `13.236.93.243:8001/api/apply/cancelUser/${id}`, //접수취소
          "#{LINK2}": `woodlink.netlify.app/Delivery/${id}`, //배송지 변경
        },
        disableSms: false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });
    //배송확인 문자
    const delivered = await messageService.send({
      to: apply.user.phone,
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.SOLAPI_APPLY_DELIVERED,
        variables: {
          "#{name}": apply.user.name || "",
          "#{product}": apply.product.name || "",
          "#{LINK}": "woodlink.netlify.app", //우드링크 사이트로 바로가기
          "#{LINK2}": `woodlink.netlify.app/reviewForm/${id}`, //우드링크 후기작성
        },
        disableSms: false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });
    return res.send(`
      <script>
        alert('접수가 완료되었습니다.');
    
        let os = window.navigator.userAgent || window.navigator.vendor || window.opera;
    
        if (os.toLowerCase().indexOf("android") > -1) {
          // For Android, close KakaoTalk's in-app browser
          location.href = "kakaotalk://inappbrowser/close";
        } else if (os.toLowerCase().indexOf("iphone") > -1 || os.toLowerCase().indexOf("ipad") > -1) {
          // For iPhone/iPad, close the browser on KakaoWeb
          location.href = "kakaoweb://closeBrowser";
        } else {
          // Default action for other browsers (try to close the window)
          self.close();
        }
      </script>
    `);
  } catch (err) {
    console.error("Error accept apply:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/apply/change:
 *   post:
 *     summary: 해당 id를 가진 나눔 신청의 정보를 변경합니다.
 *     tags: [API]
 *     responses:
 *       200:
 *         description: 접수 완료됨
 */

router.post("/apply/change", async (req, res) => {
  try {
    console.log("정보 변경요청");
    const { id, name, phone, address, detailedAddress } = req.body;
    let apply = await Apply.findOne({ _id: id }).populate("user").populate("product").populate("workshop").exec();
    let workshop = await Workshop.findOne({ _id: apply.product.workshop }).exec();
    const address_ = `${address}, ${detailedAddress}`;
    apply.sendto = address_;
    await apply.save();
    console.log(`변경 완료: ${address_}`);

    //공방 전송
    const changed = await messageService.send({
      //to: apply.user.phone, //현재 고객 번호. 공방으로 보내야함
      to: workshop.phone,
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.SOLAPI_APPLY_CHANGED,
        variables: {
          "#{name}": apply.user.name || "",
          "#{date}": apply.requested_at || "",
          "#{workshop}": workshop.name || "",
          "#{product}": apply.product.name || "",
          "#{price}": `${apply.product.price}만원` || "",
          "#{phone}": apply.user.phone || "",
          "#{address}": address_,
        },
        disableSms: false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });

    return res.status(200).json({ message: "변경 완료" });
  } catch (err) {
    console.error("Error change apply:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/apply/cancelUser/{id}:
 *   get:
 *     summary: 해당 id를 가진 나눔 신청을 고객 측에서 취소합니다.
 *     tags: [API]
 *     responses:
 *       200:
 *         description: 접수 완료됨
 */

router.get("/apply/cancelUser/:id", async (req, res) => {
  try {
    console.log("취소 요청");
    const id = req.params.id;
    let apply = await Apply.findOne({ _id: id }).populate("product").populate("user").exec();
    let product = await Product.findOne({ _id: apply.product._id }).exec();
    apply.status = "취소됨";
    await apply.save();

    product.status = "나눔가능";
    await product.save();
    console.log(`취소됨`);

    console.log(apply.user.phone);

    //공방 전송
    const changed = await messageService.send({
      //to: apply.user.phone, //현재 고객 번호. 공방으로 보내야함
      to: apply.product.phone, //현재 고객 번호. 공방으로 보내야함
      from: process.env.SOLAPI_PHONE, // 발신번호를 넣는곳이나 솔라피에서 등록을 해야함. 문자로 대체 발송될 경우를 위해서.
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID,
        templateId: process.env.SOLAPI_APPLY_CANCEL,
        variables: {
          "#{initiate}": "고객",
          "#{date}": apply.requested_at || "",
          "#{product}": product.name || "",
          "#{price}": `${apply.product.price}만원` || "",
        },
        disableSms: false, // 기본값(false) - 알림톡 실패시 SMS로 대체 발송함
      },
    });

    return res.send(`
      <script>
        alert('접수가 완료되었습니다.');
    
        let os = window.navigator.userAgent || window.navigator.vendor || window.opera;
    
        if (os.toLowerCase().indexOf("android") > -1) {
          // For Android, close KakaoTalk's in-app browser
          location.href = "kakaotalk://inappbrowser/close";
        } else if (os.toLowerCase().indexOf("iphone") > -1 || os.toLowerCase().indexOf("ipad") > -1) {
          // For iPhone/iPad, close the browser on KakaoWeb
          location.href = "kakaoweb://closeBrowser";
        } else {
          // Default action for other browsers (try to close the window)
          self.close();
        }
      </script>
      `);
  } catch (err) {
    console.error("Error accept apply:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
