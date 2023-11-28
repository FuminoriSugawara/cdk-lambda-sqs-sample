import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const queueClient = new SQSClient({});

export const handler = async (event: any) => {
  console.log({ event });

  const sqsQueueUrl = process.env.SQS_QUEUE_URL;
  console.log({ sqsQueueUrl });
  const command = new SendMessageCommand({
    QueueUrl: sqsQueueUrl,
    MessageBody: JSON.stringify({
      message: "Hello World",
    }),
  });

  try {
    const response = await queueClient.send(command);
    console.log({ response });
  } catch (e) {
    console.error(e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "SQS Queue created",
    }),
  };
};
