const accountService = require('../../../../../v1/account/account.service');
const setupTestDB = require('../../../../utils/setupTestDB');

setupTestDB();

describe('Account service', () => {
  it('has a module', () => {
    expect(accountService).toBeDefined();
    const expected = 'object';
    const actual = typeof accountService;
    expect(expected).toBe(actual);
    expect(1).toEqual(1);
  });
});
