<!--
title: 'Linkedout Send Contact Info'
description: ''
layout: Doc
authorLink: ''
authorName: 'François Pellissier'
-->
# Linkedout Send Contact Info

This sends an email to Entourage staff containing form information from VG landing page


## Invoke the function locally

```bash
serverless invoke local --function sendContactInfoByMail -p test_event.json
```

Which should result in:

```bash
Serverless: Your function ran successfully.

{
    "statusCode": 200,
    "body": "{\"message\":\"Mail sent !\"}"
}
```

## Deploy

In order to deploy the endpoint, simply run:

```bash
sls deploy -s dev
sls deploy -s prod
```


## Usage

You can now invoke the Lambda directly and even see the resulting log via

```bash
serverless invoke local --function sendContactInfoByMail --log
```

or as send an HTTP request directly to the endpoint using a tool like curl

```bash
curl --location --request POST 'https://api-preprod.linkedout.entourage.social/contact' --header 'Content-Type: application/json' --data-raw '{"security": "","name": "francois","phone": "XXX", "email": "francois@entourage.social","details": "blahblah"}'
```

## Scaling

By default, AWS Lambda limits the total concurrent executions across all functions within a given region to 100. The default limit is a safety limit that protects you from costs due to potential runaway or recursive functions during initial development and testing. To increase this limit above the default, follow the steps in [To request a limit increase for concurrent executions](http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html#increase-concurrent-executions-limit).

##URL

https://api.linkedout.entourage.social/contact

https://api-preprod.linkedout.entourage.social/contact

sans le nom de domaine (direct aws):

https://lyq3b1ryvk.execute-api.eu-west-1.amazonaws.com/dev/contact   (attention au /dev)

https://71l9vio4ba.execute-api.eu-west-1.amazonaws.com/prod/contact   (attention au /prod)