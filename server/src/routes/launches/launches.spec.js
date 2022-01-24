const app = require("../../../src/app");
const request = require("supertest");

describe("TEST GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app).get("/launches").expect(200);
  });
});

describe("TEST POST /launches", () => {
  test("It should respond with 200 success", async () => {});

  test("It should catch missing required properties", async() => {
    const response = await request(app)
      .post("/launches")
      .send({
        name: "NASA, ZTM-1",
      })
      .expect(400);
    expect(response.body).toMatchObject({
      error: "Missing required launch property",
    });
    // console.log(response.statusCode);
    expect(response.body.error).toBe("Missing required launch property")
  });

  test("It should catch invalid dates", () => {});
});
