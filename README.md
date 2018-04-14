# 0x4447 Toolbox AWS Lambda Send Email

The purpose of this AWS Lambda function is to quickly add email sending capabilities to your project. Once deployed you can invoke this function with the following payload:

```
{
    from        : '"First Last" <name@example.com>',
    to          : 'name@example.com',
    subject     : 'Nice subject',
    reply_to    : 'name@example.com'                    || '',
    html        : '<p>HTML version of the message</p>'  || '',
    text        : 'Plaintext version of the messag'     || ''
}
```

The function will return the `messageId` and `response` so you can log the ID of the sent email

```
{
    messageId: '<000000000000000000000000000@email.amazonses.com>',
    response: '0000000000000-0000-000-000-000-000-000000' 
}
```

# IAM Role

For the function to work you'll need to create a Role with the following policies:

- AWSLambdaBasicExecutionRole
- AmazonSESFullAccess

# The End

If you enjoyed this article/project, please consider giving it a 🌟. And check out our [0x4447 GitHub account](https://github.com/0x4447), where we have additional articles and tools that you might find interesting.

# For Hire 👨‍💻 👩‍💻

If you'd like us to help you with something, please feel free to say hello@0x4447.com, and share what's on your mind. We'll take a look, and try our best to help you. Or visit our website at: [0x4447.com](https://0x4447.com).
