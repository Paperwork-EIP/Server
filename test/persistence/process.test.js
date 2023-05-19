const db = require('../../src/persistence/db');
const Process = require('../../src/persistence/process');
const init_db = require('../../src/persistence/init-db');

describe('Process Persistence Tests', () => {
    beforeAll(() => {
        init_db.initAll();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('[CREATE] should create a process', async () => {
        const title = 'Random Test That Title Is Unique';
        const description = 'This is a test process';
        const delay = 5;

        const response = await Process.create(title, delay);
        await Process.delete(response.id);

        expect(response).toEqual({
            id: expect.any(Number),
            title: expect.stringMatching(title),
        });
    });
    it('[CREATE] should create a process without delay', async () => {
        const title = 'Random Test That Title Is Unique 3';
        const description = 'This is a test process';

        const response = await Process.create(title);
        await Process.delete(response.id);

        expect(response).toEqual({
            id: expect.any(Number),
            title: expect.stringMatching(title),
        });
    });
    it('[CREATE] should throw an error if the process fails to create', async () => {
        await expect(Process.create()).rejects.toThrow();
    });
    it('[DELETE] should delete the process with the given id', async () => {
        const title = 'Random Test That Title Is Unique 43545';
        const description = 'This is a test process';

        const create_response = await Process.create(title);
        const response = await Process.delete(create_response.id);

        expect(create_response).not.toBeNull();
        expect(response).not.toBeNull();
    });
    it('[DELETE] should throw an error if invalid id', async () => {
        const id = 645675471;

        try {
            await Process.delete(id);
        } catch (error) {
            expect(error).not.toBeNull();
            expect(error).toEqual('Error');
        }
    });
    it('[DELETE] should throw an error if an error occurs', async () => {
        try {
            jest.spyOn(db, 'query').mockResolvedValue(() => { new Error });
            await expect(Process.delete()).rejects.toThrow();
        } catch (error) {
            console.log(error);
        }
    });
    it('[GET] should return the process with the given title', async () => {
        const title = 'Random Test That Title Is Unique 3454';
        const expectedResponse = {
            id: expect.any(Number),
            title: title,
            delay: null
        };

        await Process.create(title);
        const response = await Process.get(title);
        await Process.delete(response.id);

        expect(response).toEqual(expectedResponse);
    });
    it('[GET BY ID] should return the process with the given id', async () => {
        const title = 'Random Test That Title Is Unique 345345';
        
        await Process.create(title);
        const process = await Process.get(title);

        const expectedResponse = {
            id: process.id,
            title: title,
            delay: null
        };

        const response = await Process.getById(process.id);
        await Process.delete(response.id);

        expect(response).toEqual(expectedResponse);
    });
    it('[GET ALL] should return an array of objects with title', async () => {
        const title = 'Random Test That Title Is Unique 38678345njkbh';
        
        const created_process = await Process.create(title);
    
        const response = await Process.getAll();
        
        await Process.delete(created_process.id);

        expect(response).toBeInstanceOf(Array);
        expect(response[0]).toHaveProperty('title');
    });
});