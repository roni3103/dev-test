const app = require('../server');
const axios = require('axios');
const config = require('../config/development');

const search = require('./search');
const mockData = require('../mocks/mock-data');

jest.spyOn(global.console, 'log'); 

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

describe("SEARCH - success", () => {
    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve( 
            { data: mockData.fakeSuccessResponse }));
    });
    afterEach(() => {
        jest.resetAllMocks();
    })
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

describe("SEARCH - error", () => {
    afterEach(()=> {
        jest.resetAllMocks();
    })
    test("An error with no message should log a generic message", async () => {
        // arrange
        const req = mockRequest();
        const res = mockResponse();
        axios.get.mockImplementationOnce(() => Promise.reject(new Error()));
        const result = await search.getAllUsers(req, res);
        expect(result).not.toBeDefined();
        expect(console.log).toHaveBeenCalledWith('Internal error please raise incident')
    });

    test("An error with a message should display the given message", async () => {
        // arrange
        const req = mockRequest();
        const res = mockResponse();
        const customErr = {
            message: 'fakerr'
        }
        axios.get.mockImplementationOnce(() => Promise.reject(new Error(customErr.message)));

        // act
        const result = await search.getLondonUsers(req, res);

        // assert
        expect(result).not.toBeDefined();
        expect(console.log).not.toHaveBeenCalledWith('Internal error please raise incident');
        expect(console.log).toHaveBeenCalledWith('fakerr');

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
    
})