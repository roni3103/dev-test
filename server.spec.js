const app = require('./server');
const supertest = require('supertest');
const axios = require('axios');
const config = require('./config/development');

const search = require('./api/search');
const mockData = require('./mocks/mock-data');

jest.mock('axios');

const mockRequest = () => {
    fakeHeader : 'fake'
}

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send =  jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// BELOW REMAIN AS SHOULD TEST API ROUTES
// NOT GOOD TESTS - THEY DON'T REPRESENT WHAT I THOUGHT IF I RETURN THE RESPONSE BODY
test('It should return the deduplicated list of users and 200 for base route', async () => {
    // success - what should the API work with?
    // const req = mockRequest();
    // const res = mockResponse();
    await supertest(app).get("/")
    .then((response) => {
        expect(200)
        expect(response.body).toBeDefined();
        console.log('res', response.body)
        expect(typeof(response.body)).toBe('object');
        
    });
});

test('It should return 200 and list of all users when calling the /all-users route', async () => {
    // success - what should the API work with?
    await supertest(app).get("/all-users")
    .then((response) => {
        expect(200)
        expect(response.body).toBeDefined();
        expect(typeof(response.body)).toBe('object');
    });
});

test('It should return 200 and list of London users when calling the /london-users route', async () => {
    // success - what should the API work with?
    await supertest(app).get("/london-users")
    .then((response) => {
        expect(200)
        expect(response.body).toBeDefined();
        expect(typeof(response.body)).toBe('object');
    });
});

test('It should return the current version', async () => {
    // success - what should the API work with?
    const version = require('./package.json').version;
    await supertest(app).get("/version")
    .then((response) => {
        expect(200)
        expect(response.body).toBeDefined();
        expect(response.text).toBe(version);
    });
});

test('It should return a 404 for a non-existent endpoint', async () => {
    // failure - scenarios that would not work
    await supertest(app).get("/blob")
    .expect(404)
    .then((response) => {
        expect(response.error).toBeDefined();
        expect(typeof(response.error)).toBe('object');
        expect(response.status).toBe(404);
        expect(response.error.text).toContain('Cannot GET /blob');
    });
});

test("It should return 404 for an incorrect http verb", async () => {
    // incorrect verb
    await supertest(app).post("/")
    .expect(404)
    .then((response) => {
        expect(response.error).toBeDefined();
        expect(typeof(response.error)).toBe('object');
        expect(response.status).toBe(404)
    });
    
})