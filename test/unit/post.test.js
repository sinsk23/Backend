const PostController = require("../../controllers/posts.controller");
const postController = new PostController();
const httpMocks = require("node-mocks-http");
const { Post } = require("../../models");
const newPost = require("../data/new-post.json");
const { describe } = require("../../models/user");
Post.create = jest.fn();
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe("Post Controller 생성", () => {
  it("Should have a createPost function", () => {
    expect(typeof postController.createPost).toBe("function");
  });
  it("Should return 201 status code", async () => {
    await postController.createPost(req, res, next);
    expect(res.statusCode).toBe(201);
  });
  it("should return json body in response", async () => {
    Post.create.mockReturnValue(newPost);
    await postController.createPost(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newPost);
  });
});
