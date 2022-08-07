const app = require('./server');
const supertest = require('supertest');

test('api test - base route', async () => {
    // success - what should the API work with?
    await supertest(app).get("/")
    .then((response) => {
        expect(200)
        expect(response.body).toBeDefined();
        expect(typeof(response.body)).toBe('object');
    });
});
test('api test - allusers', async () => {
    // success - what should the API work with?
    await supertest(app).get("/all-users")
    .then((response) => {
        expect(200)
        expect(response.body).toBeDefined();
        expect(typeof(response.body)).toBe('object');
    });
});

test('api test - londonusers', async () => {
    // success - what should the API work with?
    await supertest(app).get("/london-users")
    .then((response) => {
        expect(200)
        expect(response.body).toBeDefined();
        expect(typeof(response.body)).toBe('object');
    });
});

test('api test - version', async () => {
    // success - what should the API work with?
    const version = require('./package.json').version;
    await supertest(app).get("/version")
    .then((response) => {
        expect(200)
        expect(response.body).toBeDefined();
        console.log(response.text)
        expect(response.text).toBe(version);
    });
});

test('api test - incorrect route', async () => {
    // failure - scenarios that would not work
    await supertest(app).get("/blob")
    .expect(404)
    .then((response) => {
        expect(response.error).toBeDefined();
        expect(typeof(response.error)).toBe('object');
        expect(response.status).toBe(404)
    });
});

test("API test - incorrect verb", async () => {
    // incorrect verb
    await supertest(app).post("/")
    .expect(404)
    .then((response) => {
        expect(response.error).toBeDefined();
        expect(typeof(response.error)).toBe('object');
        expect(response.status).toBe(404)
    });
    
})