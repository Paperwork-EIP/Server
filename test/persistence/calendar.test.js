const db = require('../../src/persistence/db');
const Calendar = require('../../src/persistence/calendar');

describe('Calendar Peristence Tests', () => {
    let date, user_process_id, step_id, appoinment;

    beforeEach(() => {
        date = '2020-09-01 12:00:00';
        user_process_id = 1423234;
        step_id = 25656;
        appoinment = new Date();

        jest.spyOn(db, 'query').mockResolvedValue({ rows: [{ appoinment: appoinment, id: 1 }] });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('[SET] should call db.query with the correct parameters', async () => {
        await Calendar.set(date, user_process_id, step_id);
        await Calendar.set(null, user_process_id, step_id)

        expect(db.query).toHaveBeenCalled();
    });
    it('[SET] should return the correct data', async () => {
        let result = await Calendar.set(date, user_process_id, step_id);

        expect(JSON.stringify(result)).toEqual(JSON.stringify({ appoinment: appoinment, id: 1 }));
    });
});
