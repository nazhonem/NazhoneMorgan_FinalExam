let server = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp); 
const { expect } = chai;
var assert = chai.assert;

describe("Server!", () => {

    it("Returns all the operations", done => {
      chai
        .request(server)
        .get("/reviews")
        .end((err, res) =>{
          expect(res).to.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.not.be.eq(0);
          done();
        });
    });

    it("Add a new operation to the ops list", done => {
      chai
        .request(server)
        .post("/add_review")
        .send({meal_name:"meal", review:"review"})
        .end((err, res) => {
          expect(res).to.have.status(201);
          res.body.should.have.property("meal_name").eq("meal");
          res.body.should.have.property("review").eq("review");
          done();
        });
    });

  });
