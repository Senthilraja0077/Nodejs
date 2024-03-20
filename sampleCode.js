// 2.GENERATE A RANDOM RESET TOKEN
const resetToken = user.data.createResetPasswordToken();
// console.log("user-->", resetToken);
await user.data.save({ validateBeforeSave: false });
// 3.SEND THE TOKEN BACK TO THE USER EMAIL
const resetUrl = `${req.protocol}://${req.get(
  "host"
)}/resetpassword/${resetToken}`;
const msg = `We have recived a password reset request .please use the below link to reset your password
   \n\n ${resetUrl} \n\n This reset password link will be valid only for 10  mins `;
try {
  await sendEmail({
    email: user.data.email,
    subject: "Password change request recived",
    message: msg,
  });

  res.status(200).json({
    status: "success",
    message: "password reset link send to the user email",
  });
} catch (err) {
  user.data.passwordResetToken = undefined;
  user.data.passwordResetTokenExpires = undefined;
  user.data.save({ validateBeforeSave: false });
  return next(
    new CustomError(
      "There was an error sending password reset email.Please try again later ",
      500
    )
  );
}
