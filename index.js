let AWS = require("aws-sdk");
let nodemailer = require('nodemailer');
let validate = require('validate.js');

//
//	Initiate the SES Object with Node Mailer
//
let	transporter = nodemailer.createTransport({

	SES: new AWS.SES({
		region: process.env.AWS_REGION
	})

});

//
//	Handle the request
//
exports.handler = function(event, context, callback) {

	//
	//	1.	Create a continer to be passed in the chain
	//
	let container = {
		message: {
		    from	: event.from,
		    to		: event.to,
		    subject	: event.subject,
		    replyTo	: event.reply_to	|| '',
		    html	: event.html		|| '',
		    text	: event.text		|| ''
		}
	};
	

	//
	//	2.	Start the chain
	//
	request_validation(container)
		.then(function(container) {

			return send_the_email(container);

		}).then(function(container) {

			//
			//	->	Let AWS know we finished
			//
			callback(null, container.response);

		}).catch(function(error) {

			//
			//	->	Stop everything and bouble up the error message
			//
			callback(error);

		});
};

//	 _____   _____    ____   __  __  _____   _____  ______   _____
//	|  __ \ |  __ \  / __ \ |  \/  ||_   _| / ____||  ____| / ____|
//	| |__) || |__) || |  | || \  / |  | |  | (___  | |__   | (___
//	|  ___/ |  _  / | |  | || |\/| |  | |   \___ \ |  __|   \___ \
//	| |     | | \ \ | |__| || |  | | _| |_  ____) || |____  ____) |
//	|_|     |_|  \_\ \____/ |_|  |_||_____||_____/ |______||_____/
//

//
//	Make sure the user entered all the data, and the data is valid
//
function request_validation(container)
{
	return new Promise(function(resolve, reject) {

		//
		//	1.	Check if the data conforms
		//
		let result = validate(container.message, constraints);

		//
		//	2.	Check if Validate found some issues
		//
		if(result)
		{
			//
			//	->	Stop and pass the error forward
			//
			return reject({
				statusCode: 400,
				message: result
			});
		}

		//
		//	->	Move to the next chain
		//
		return resolve(container);

	});
}

//
//	Send out the email
//
function send_the_email(container, callback)
{
	return new Promise(function(resolve, reject) {

		//
		//	1.	Send out the email
		//
		transporter.sendMail(container.message, function(error, info) {

			//
			//	1.	Check if there was an error
			//
			if(error)
			{
				return reject(error);
			}

			//
			//	2.	Save the response from SES so we can send it back 
			//		to the other side for confirmation and logging
			//
			container.response = {
				messageId: info.messageId,
				response: info.response
			};
			
			//
			//   ->  Move to the next chain
			//
			return resolve(container);

		});

	});
}

//  _    _   ______   _        _____    ______   _____     _____
// | |  | | |  ____| | |      |  __ \  |  ____| |  __ \   / ____|
// | |__| | | |__    | |      | |__) | | |__    | |__) | | (___
// |  __  | |  __|   | |      |  ___/  |  __|   |  _  /   \___ \
// | |  | | | |____  | |____  | |      | |____  | | \ \   ____) |
// |_|  |_| |______| |______| |_|      |______| |_|  \_\ |_____/
//

//
//	Constrains to check against
//
let constraints = {
	subject: {
	    presence: true
	},
	from: {
		presence: true,
		format: {
			pattern: /(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/,
			message: "doesn't look like a valid email"
		}
	},
	to: {
		presence: true,
		format: {
			pattern: /(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/,
			message: "doesn't look like a valid email"
		}
	}
	
};