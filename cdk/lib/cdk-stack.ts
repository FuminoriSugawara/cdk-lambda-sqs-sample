import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { CfnOutput } from "aws-cdk-lib";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, "CdkQueue", {
      queueName: "CdkQueue",
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    const publisherLambdaFn = new lambda.Function(this, "PublisherLambda", {
      functionName: "PublisherLambda",
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("lambda/publisher"),
      handler: "index.handler",
      environment: {
        SQS_QUEUE_URL: queue.queueUrl,
      },
    });

    const publisherLambdaUrl = publisherLambdaFn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    new CfnOutput(this, "PublisherLambdaUrl", {
      value: publisherLambdaUrl.url,
    });

    queue.grantSendMessages(publisherLambdaFn);

    const receiverLambdaFn = new lambda.Function(this, "ReceiverLambda", {
      functionName: "ReceiverLambda",
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("lambda/receiver"),
      handler: "index.handler",
    });

    queue.grantConsumeMessages(receiverLambdaFn);

    receiverLambdaFn.addEventSource(
      new lambdaEventSources.SqsEventSource(queue),
    );
  }
}
