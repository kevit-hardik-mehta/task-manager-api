const sgMail = require('@sendgrid/mail');

// const sendGridAPIKey = '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'

sgMail.setApiKey(process.env.SG_API_KEY);

const sendWelcomeEmail = (email,name) => {

    sgMail.send({
        to: email,
        from: 'kevit.hardik.mehta@gmail.com',
        subject: 'Welcome Email!!',
        text: `This is a welcome email for ${name}.`
    })
    
}


// sgMail.send({
//     to: '19comp.hardik.mehta@gmail.com',
//     from: 'kevit.hardik.mehta@gmail.com',
//     subject: 'Welcome Email!!',
//     text: `This is a welcome email for.`
// })

module.exports = sendWelcomeEmail