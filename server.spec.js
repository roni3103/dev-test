const app = require('./server');
const supertest = require('supertest');
const axios = require('axios');
const config = require('./config/development');

// const winston = require('winston');
// const logConfiguration = {
//     'transports': [
//        new winston.transports.Console()
//     ] 
// };
// const logger = winston.createLogger(logConfiguration);

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const search = require('./api/search');
const mockData = require('./mocks/mock-data');

jest.mock('axios');
global.console.log = jest.fn();

const req = () => {
    fakeHeader : 'fake'
}

const res = () => {
    const res = {
        status: 500,
        error: {
            message: "fake error message"
        }
    };
    res.status = jest.fn().mockReturnValue(res);
    res.send =  jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};


describe("API calls - success", () => {
    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve( 
            { data: mockData.fakeSuccessResponse }));
    });
    test("it should return 200 and result for getAllUsers", async () => {
        var result = await search.getAllUsers();
        expect(result.data).toBeDefined();
        expect(result.status).toBe(200);
    });
    test("it should return 200 and result for getLondonUsers", async () => {
        var result = await search.getLondonUsers();
        expect(result.data).toBeDefined();
        expect(result.status).toBe(200);
    });   
})
describe("API calls - error", () => {
    // beforeEach(() => {
    //     axios.get.mockImplementationOnce(() => Promise.reject(res.status(500).send('fakerr')));
    // })
    test.only("With an incorrect call to get all users ", async () => {
        const customErr = {
            message: 'fakerr'
        }
        axios.get.mockImplementationOnce(() => Promise.reject(new Error(customErr.message)));
        config.allUsersURL = "https://dwp-techtest.herokuapp.com/users/frogspawn"
        try {
            const result = await search.getAllUsers(req, res);
            // await expect(axios.get).toHaveBeenCalledWith("https://dwp-techtest.herokuapp.com/users/frogspawn");
        } catch (err) {
            console.log('err0', err)
            await expect(console.log).toHaveBeenCalledWith('sausageß');
        }

   
        
        
        // expect(result).not.toBeDefined();
        // expect(logger.log).toHaveBeenCalledWith('poo')
    });

    test("With an incorrect call to get London users", async () => {
        config.allUsersURL = "https://dwp-techtest.herokuapp.com/users/frogspawn"
        try {
            var result = await search.getLondonUsers(req, res);
            expect(axios.get).toHaveBeenCalledWith("https://dwp-techtest.herokuapp.com/users/frogspawn");
        } catch (err) {
            expect(console.log).toHaveBeenCalledWith(err);
        }
    });
})

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