
export function getSignupOtpTemplate(otp){
    return `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="https://firebasestorage.googleapis.com/v0/b/bondly-2ff55.appspot.com/o/logo%202.png?alt=media&token=8b877c44-cd07-4dcc-82af-346758bff6e4" alt="${process.env.APP_NAME}" style="width: 100px; margin-bottom: 20px;" />
        </div>
        <h2 style="color: #333; text-align: center;">Welcome to ${process.env.APP_NAME}!</h2>
        <p style="font-size: 16px; color: #666; text-align: center;">We're excited to have you on board. To complete your sign-up, please use the One-Time Password (OTP) below to verify your email:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 22px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 2px dashed #4CAF50; border-radius: 5px;">${otp}</span>
        </div>

        <p style="font-size: 16px; color: #666; text-align: center;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; 2024 ${process.env.APP_NAME}. All rights reserved.</p>
      </div>
    `
}

export function getForgotPasswordTemplate(userName, otp){
    return `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="https://firebasestorage.googleapis.com/v0/b/bondly-2ff55.appspot.com/o/logo%202.png?alt=media&token=8b877c44-cd07-4dcc-82af-346758bff6e4" alt="${process.env.APP_NAME}" style="width: 100px; margin-bottom: 20px;" />
        </div>
        <h2 style="color: #333; text-align: center;">Hi ${userName},</h2>
        <p style="font-size: 16px; color: #666; text-align: center;">
          We received a request to reset the password for your <strong>${process.env.APP_NAME}</strong> account. Use the One-Time Password (OTP) below to reset your password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 22px; font-weight: bold; color: #E91E63; padding: 10px 20px; border: 2px dashed #E91E63; border-radius: 5px;">${otp}</span>
        </div>

        <p style="font-size: 16px; color: #666; text-align: center;">This OTP is valid for the next 10 minutes.</p>

        <p style="font-size: 16px; color: #666; text-align: center;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `
}