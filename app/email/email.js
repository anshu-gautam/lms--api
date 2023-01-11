import sgMail from "@sendgrid/mail";

const sendGridAPIkey =
  "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";

sgMail.setApiKey(sendGridAPIkey);

const welcomeUser = async (email, name) => {
  await sgMail.send({
    to: email,
    from: "anshugautamgaming@gmail.com",
    subject: "Thanks for joining !",
    text: `Welcome to the app ${name}`,
  });
};

const orderPlaced = async (email, message) => {
  await sgMail.send({
    to: email,
    from: "anshugautamgaming@gmail.com",
    subject: "You order has been placed",
    html: message,
  });
};

export {
  welcomeUser,
  orderPlaced,
};
