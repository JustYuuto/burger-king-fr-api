const BKClient = require('..');

test('fetching a restaurant id', async () => {
  const client = new BKClient({});
  await client.login('<account bearer>');
  expect(await client.restaurant.fetch('K0129')).toHaveProperty('id');
});