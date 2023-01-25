const ProcessProposal = require('../../src/persistence/processProposal');
const db = require('../../src/persistence/db');

describe('Process Proposal Persistence Tests', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('[CREATE] should create a process', async () => {
        const title = 'Random Test That Title Is Unique';
        const description = 'This is a test process';
        const content = 'Test Content';
        const user_id = 5;

        const response = await ProcessProposal.create(title, description, content, user_id);
        await ProcessProposal.delete(response.id);

        expect(response).toEqual({
            id: expect.any(Number),
            title: expect.stringMatching(title),
        });
    });
    it('[CREATE] should throw an error if 0 arguments', async () => {
        await expect(ProcessProposal.create()).rejects.toThrow();
    });
    it('[CREATE] should throw an error if 1 argument', async () => {
        await expect(ProcessProposal.create('something')).rejects.toThrow();
    });
    it('[CREATE] should throw an error if 2 arguments', async () => {
        await expect(ProcessProposal.create('something', 'something')).rejects.toThrow();
    });
    it('[CREATE] should throw an error if 3 arguments', async () => {
        await expect(ProcessProposal.create('something', 'something', 'something')).rejects.toThrow();
    });
    it('[DELETE] should delete the process with the given id', async () => {
        const title = 'Random Test That Title Is Unique 43545';
        const description = 'This is a test process';
        const content = 'Test Content';
        const user_id = 5;

        const create_response = await ProcessProposal.create(title, description, content, user_id);
        const response = await ProcessProposal.delete(create_response.id);

        expect(create_response).not.toBeNull();
        expect(response).not.toBeNull();
    });
    it('[DELETE] should throw an error if an error occurs', async () => {
        const id = 645675471;

        try {
            ProcessProposal.delete(id);
        } catch (error) {
            expect(error).not.toBeNull();
            expect(error).toEqual('Error');
        }
    });
    it('[DELETE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { throw new Error });
        await expect(ProcessProposal.delete()).rejects.toThrow();
    });
    it('[GET] should return the process with the given title', async () => {
        const title = 'Random Test That Title Is Unique 3455754';
        const description = 'This is a test process';
        const content = 'Test Content';
        const user_id = 5;
        const expectedResponse = {
            id: expect.any(Number),
            title: title,
            description: description,
            content: content,
            date: expect.any(Date),
            user_id: user_id,
            is_in_process: expect.any(Boolean)
        };

        const create_response = await ProcessProposal.create(title, description, content, user_id);
        const response = await ProcessProposal.get(create_response.id);
        await ProcessProposal.delete(create_response.id);

        expect(response).not.toBeNull();
        expect(response.id).toEqual(expectedResponse.id);
        expect(response.title).toEqual(expectedResponse.title);
        expect(response.description).toEqual(expectedResponse.description);
        expect(response.content).toEqual(expectedResponse.content);
        expect(response.date).toEqual(expectedResponse.date);
        expect(response.user_id).toEqual(expectedResponse.user_id);
        expect(response.is_in_process).toEqual(expectedResponse.is_in_process);
    });
    it('[GET] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { throw new Error });
        await expect(ProcessProposal.get()).rejects.toThrow();
    });
    it('[GET ALL] should return all process', async () => {
        const response = await ProcessProposal.getAll();

        expect(response).toEqual(expect.any(Object));
    });
    it('[GET ALL] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockRejectedValueOnce(() => { throw new Error });
        await expect(ProcessProposal.getAll()).rejects.toThrow();
    });
});
