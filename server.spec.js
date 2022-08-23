const app = require('./server');
const supertest = require('supertest');
const axios = require('axios');

const request = supertest(app);
const search = require('./api/search');
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

jest.spyOn(global.console, 'log'); 
const VERSION = require('./package.json').version;
beforeEach(() => {
    jest.setTimeout(10000)
    jest.resetAllMocks();
})
test('It should return the deduplicated list of users and 200 for base route', async () => {
    // success - what should the API work with?
    
    const response = await request.get('/')
  
    expect(response.status).toBe(200)
    expect(typeof(response.body)).toBe("object")
    expect(response.text).toContain('latitude') 
});

test('It should return 200 and list of all users when calling the /all-users route', async () => {
    // success - what should the API work with?
    const response = await request.get('/all-users')
  
    expect(response.status).toBe(200)
    expect(typeof(response.body)).toBe("object")
    expect(response.text).toContain('latitude')
});

test('It should return 200 and list of London users when calling the /london-users route', async () => {
    // success - what should the API work with?
    const response = await request.get('/london-users')
  
    expect(response.status).toBe(200)
    expect(typeof(response.body)).toBe("object")
    expect(response.text).toContain('latitude')

});

test('It should return the current version', async () => {
    // success - what should the API work with?
    const response = await request.get('/version');
    expect(response.status).toBe(200);
    expect(response.text).toEqual(VERSION);

});

// TODO - RESTYLE TO MATCH THE OTHER TESTS
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

// TODO - RESTYLE TO MATCH THE OTHER TESTS
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

// TODO - WORK OUT HOW TO FAKE THIS ONE
test('It should return a 500 for any other errors', async () => {
    // failure - scenarios that would not work
    const req = mockRequest();
    const res = mockResponse();
    axios.get.mockImplementationOnce(() => Promise.reject(new Error()));
    await supertest(app).get("/")
    .expect(500)
    .then((response) => {
        expect(response.error).toBeDefined();
        expect(typeof(response.error)).toBe('object');
        expect(response.status).toBe(500);
        expect(response.error.text).toContain('Internal error please raise incident');
    });
});