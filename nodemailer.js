const nodemailer = require("nodemailer");


// servidor para el envio de correo
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
        user: 'alfonsspj@gmail.com',
        pass: 'rmonaywzvmhnjbus'
    }
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'alfonsspj@gmail.com', // sender address
        to: "bibliotecaspj@gmail.com", // list of receivers
        subject: "correo de prueba", // Subject line
        text: "Hola, este es un mensaje de prueba", // plain text body
        html: "<b>Hola, este es un mensaje de prueba</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

sendMail();
