const app = require('./server');
const supertest = require('supertest');
const request = supertest(app);

const search = require('./api/search');
const mockData = require('./mocks/mock-data');

const consoleSpy = jest.spyOn(global.console, 'log');
const distanceSpy = jest.spyOn(search, 'findUsersWithinDistance');
const combinedSpy = jest.spyOn(search, 'combineUsers');
const VERSION = require('./package.json').version;

beforeEach(() => {
    jest.setTimeout(10000)
    jest.resetAllMocks();
})

test('It should return the deduplicated list of users and 200 for base route', async () => {

    jest.spyOn(search, 'getAllUsers').mockReturnValue(mockData.allUsersArray);
    jest.spyOn(search, 'getLondonUsers').mockReturnValue(mockData.londonUsersArray);
    jest.spyOn(search, 'findUsersWithinDistance').mockReturnValue(mockData.withinFiftyArray);

    const response = await request.get('/')
    
    expect(response.status).toBe(200)
    expect(distanceSpy).toHaveBeenCalledWith(mockData.allUsersArray, mockData.londonLatLon)
    expect(combinedSpy).toHaveBeenCalledWith(mockData.londonUsersArray, mockData.withinFiftyArray)
    expect(response.body).toBeDefined();
});

test('It should return 200 and list of all users when calling the /all-users route', async () => {
    jest.spyOn(search, 'getAllUsers').mockReturnValue(mockData.allUsersArray);

    const response = await request.get('/all-users')
  
    expect(response.status).toBe(200)
    expect(typeof(response.body)).toBe("object")
    expect(response.text).toContain('latitude')
});

test('It should return 200 and list of London users when calling the /london-users route', async () => {
    jest.spyOn(search, 'getLondonUsers').mockReturnValue(mockData.londonUsersArray);
    const response = await request.get('/london-users')
  
    expect(response.status).toBe(200)
    expect(typeof(response.body)).toBe("object")
    expect(response.text).toContain('latitude')

});

test('It should return the current version', async () => {
    const response = await request.get('/version');
    expect(response.status).toBe(200);
    expect(response.text).toEqual(VERSION);

});

test('It should return a 404 for a non-existent endpoint', async () => {
    // failure - scenarios that would not work
    const response = await request.get("/blob");
    expect(response.status).toBe(404);
    expect(response.error).toBeDefined();
    expect(typeof(response.error)).toBe('object');
    expect(response.error.text).toContain('Cannot GET /blob');

});

test("It should return 404 for an incorrect http verb", async () => {
    // incorrect verb
    const response = await request.post("/")
    expect(response.status).toBe(404);
    expect(response.error).toBeDefined();
    expect(typeof(response.error)).toBe('object');
    expect(response.error.text).toContain('Cannot POST /');
    
})

test('It should return a 500 for any other errors on base route', async () => {
    
    // fail one of the calls so the overall one will fail
    await jest.spyOn(search, 'getAllUsers').mockRejectedValue(new Error());
    const response = await request.get("/");
 
    expect(response.error).toBeDefined();
    expect(typeof(response.error)).toBe('object');
    expect(response.status).toBe(500);
    expect(response.error.text).toContain('Internal error please raise incident');

});

test('It should return a 500 for any other errors on all-users route', async () => {
    
    await jest.spyOn(search, 'getAllUsers').mockRejectedValue(new Error());
    const response = await request.get("/all-users");
 
    expect(response.error).toBeDefined();
    expect(typeof(response.error)).toBe('object');
    expect(response.status).toBe(500);
    expect(response.error.text).toContain('Internal error please raise incident');

});

test('It should return a 500 for any other errors on london-users route', async () => {
    
    await jest.spyOn(search, 'getLondonUsers').mockRejectedValue(new Error());
    const response = await request.get("/london-users");
 
    expect(response.error).toBeDefined();
    expect(typeof(response.error)).toBe('object');
    expect(response.status).toBe(500);
    expect(response.error.text).toContain('Internal error please raise incident');

});
