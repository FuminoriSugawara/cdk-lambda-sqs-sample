import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const queue = new sqs.Queue(this, 'CdkQueue', {
      queueName: 'CdkQueue',
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    const lambdaFn = new lambda.Function(this, 'CdkLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
    });

    queue.grantSendMessages(lambdaFn);
  }
}
