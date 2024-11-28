// swagger/swagger.js
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "우드링크 API 리스트",
      version: "1.0.0",
      description: "기본적으로 'http://13.236.93.243:8001/' 를 주소 앞에 붙입니다.",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "User's name",
              example: "John Doe",
            },
            phone: {
              type: "string",
              description: "User's phone number",
              example: "01011112222",
            },
            address: {
              type: "string",
              description: "User's address",
              example: "123 Main St, Springfield",
            },
          },
        },
        Workshop: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Workshop name",
              example: "Woodworking Workshop",
            },
            phone: {
              type: "string",
              description: "Workshop phone number",
              example: "01012345678",
            },
            address: {
              type: "string",
              description: "Workshop address",
              example: "456 Elm St, Springfield",
            },
            content: {
              type: "string",
              description: "Details about the workshop",
              example: "A workshop for woodworking enthusiasts.",
            },
            status: {
              type: "string",
              description: "Current status of the workshop",
              example: "active",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            workshop: {
              type: "string",
              description: "공방 id",
              example: "673eb2c1c72913a3bd35acba",
            },
            name: {
              type: "string",
              description: "상품명",
              example: "Wooden Table",
            },
            category: {
              type: "string",
              description: "desk, table, chair, expendables, etc",
              example: "table",
            },
            cost: {
              type: "integer",
              description: "Cost of the product",
              example: 100,
            },
            price: {
              type: "integer",
              description: "Selling price of the product",
              example: 50,
            },
            size: {
              type: "array",
              items: {
                type: "integer",
              },
              description: "List of available sizes for the product",
              example: [100, 120, 90],
            },
            reason: {
              type: "string",
              description: "하자품인 이유",
              example: "상판 약간 긁힘",
            },
            img: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Image URLs of the product",
              example: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
            },
            status: {
              type: "string",
              description: "Product status",
              example: "available",
            },
          },
        },
        Review: {
          type: "object",
          properties: {
            user: {
              type: "string",
              description: "고객 키값",
              example: "673e9c5d3c176d103a4ed9b4",
            },
            product: {
              type: "string",
              description: "상품 키값",
              example: "673e9c5d3c176d103a4ed9b4",
            },
            content: {
              type: "string",
              description: "Review content",
              example: "Great product!",
            },
            img: {
              type: "string",
              description: "Image content",
              example: "img.jpg",
            },
          },
        },
        Apply: {
          type: "object",
          properties: {
            user: {
              type: "String",
              description: "고객 id",
              example: "673e9c5d3c176d103a4ed9b4",
            },
            product: {
              type: "String",
              description: "상품 id",
              example: "673e9c5d3c176d103a4ed9b4",
            },
            workshop: {
              type: "String",
              description: "공방 id",
              example: "673e9c5d3c176d103a4ed9b4",
            },
            sendto: {
              type: "String",
              description: "배송지",
              example: "aaa시 bbb동 ccc로 ddd동 eee호",
            },
            requested_at: {
              type: "string",
              format: "date",
              description: "Date when the application was requested",
              example: "2022-02-01",
            },
            updated_at: {
              type: "string",
              format: "date",
              description: "Date when the application was last updated",
              example: "2022-02-02",
            },
            status: {
              type: "string",
              description: "Current status of the application",
              example: "pending",
            },
          },
        },
        API: {
          type: "object",
          properties: {
            name: {
              type: "String",
              description: "이름",
              example: "이름",
            },
            phone: {
              type: "String",
              description: "전화번호",
              example: "01011112222",
            },
            address: {
              type: "String",
              description: "주소",
              example: "주소",
            },
            productId: {
              type: "String",
              description: "제품 id",
              example: "673ebc5ee17e3a79f7862343",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
