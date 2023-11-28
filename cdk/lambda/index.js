export const handler = async (event) => {
  console.log({ event })
  console.log('Hello from Lambda');
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda',
    }),
  };
}