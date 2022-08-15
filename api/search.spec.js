const app = require('../server');
const supertest = require('supertest');
const axios = require('axios');
const config = require('../config/development');

const search = require('./search');
const mockData = require('../mocks/mock-data');

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

// TODO - MOVE TO SEARCH
describe("SEARCH - success", () => {
    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve( 
            { data: mockData.fakeSuccessResponse }));
    });
    test("it should return 200 and result for getAllUsers", async () => {
        const result = await search.getAllUsers();
        expect(result.data).toBeDefined();
        expect(result.status).toBe(200);
    });
    test("it should return 200 and result for getLondonUsers", async () => {
        var result = await search.getLondonUsers();
        expect(result.data).toBeDefined();
        expect(result.status).toBe(200);
    });   
})

// TODO - PASSES BUT WON'T FAIL - SOMETHING NOT RIGHT
describe("SEARCH - error", () => {
    test("With an incorrect call to get all users ", async () => {
        // arrange
        const req = mockRequest();
        const res = mockResponse();
        const customErr = {
            message: 'fakerr'
        }
        axios.get.mockImplementationOnce(() => Promise.reject(new Error(customErr.message)));
        config.allUsersURL = "https://dwp-techtest.herokuapp.com/frogspawn"
        try {
            // act
            const result = await search.getAllUsers(req, res);
            await expect(axios.get).toHaveBeenCalledWith("https://dwp-techtest.herokuapp.com/frogspawn");
        } catch (err) {  
            // assert
            await expect(res.status).toHaveBeenCalledWith(500);
            await expect(res.send).toHaveBeenCalledWith(new Error(customErr.message));
        }
    });

    test("With an incorrect call to get London users", async () => {
        // arrange
        const req = mockRequest();
        const res = mockResponse();
        const customErr = {
            message: 'fakerr'
        }
        axios.get.mockImplementationOnce(() => Promise.reject(new Error(customErr.message)));
        config.londonersURL = "https://fakeurl"

        try {
            // act
            const result = await search.getLondonUsers(req, res);
        } catch (err) {  
            // assert 
            await expect(res.status).toHaveBeenCalledWith(500);
            await expect(res.send).toHaveBeenCalledWith(new Error(customErr.message));
        }
    });
    
})

describe("findUsersWithinDistance", () => {
    test("reduces the array to users within fifty miles of given location", () => {
        var testArray = mockData.allUsersArray;
        var result = search.findUsersWithinDistance(testArray, mockData.londonLatLon);
        expect(result.length).toBe(3);
        expect(result).not.toContain('"first_name": "Katee",');
    })
})

describe("filter and combine users", () => {
    test("should combine users within distance and the london users with no duplicates", () => {
        var londonUsersArray = mockData.londonUsersArray;
        var withinFiftyArray = mockData.withinFiftyArray;
        var result = search.combineUsers(londonUsersArray, withinFiftyArray);
        expect(result.length).toBe(9);
    })

    // TODO - TEST FOR FILTER AND COMBINE

    
})