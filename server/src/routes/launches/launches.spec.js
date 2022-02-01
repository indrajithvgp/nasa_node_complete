const request = require("supertest");
const app = require("../../../src/app");
const {mongoConnect, mongoDisconnect} = require("../../../src/services/mongo");

describe("Launches API", ()=>{

  beforeAll(async ()=>{
    await mongoConnect();
  })

  afterAll(async ()=>{
    await mongoDisconnect();
  })

  describe("TEST GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app).get("/launches").expect(200);
    });
  });

  describe("TEST POST /launches", () => {
    test("It should respond with 200 success", async () => {});

    test("It should catch missing required properties", async (done) => {
      const response = await request(app)
        .post("/launches")
        .send({
          name: "NASA, ZTM-1",
        })
        .expect(400).end(done);
      expect(response.body).toMatchObject({
        error: "Missing required launch property",
      });
      // console.log(response.statusCode);
      expect(response.body.error).toBe("Missing required launch property");
    });

    test("It should catch invalid dates", (done) => {
      const response = request(app)
        .post("/launches")
        .send({
          name: "NASA, ZTM-1",
          date: "2020-01-01",
        })
        .expect(400)
        .end(done);
      // expect(response.body).toMatchObject({
      //   error: "Invalid date format",
      // });
      // expect(response.body.error).toBe("Invalid date format");
    });
  });

})


