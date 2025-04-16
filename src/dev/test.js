import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: 'quanphuly24@gmail.com',
    pass: 'azzpejdussfhfgvs'  // Use App Password if you have 2FA enabled
}
});

// Email options
const mailOptions = {
    from: 'quanphuly24@gmail.com',
    to: 'korehaShirina@gmail.com',
    subject: 'Noreply: Password change request',
    html: `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8e7; font-family: 'Roboto Serif', serif; color: #87a706; text-align: center; padding: 40px 0;">
  <tr>
    <td align="center">
      <img src="cid:logo" alt="logo" width="187" style="display: block;" />
    </td>
  </tr>
  <tr>
    <td>
      <h2 style="margin: 20px 0 10px; font-size: 36px; font-weight: 500;">Quên mật khẩu?</h2>
      <p style="font-size: 16px; margin: 0;">Đừng lo, mật khẩu của bạn không đi đâu cả, miễn là bạn nhớ mail của bạn :v</p>
    </td>
  </tr>
  <tr>
    <td>
      <hr style="margin: 40px 0; border-top: 1px solid rgba(135, 167, 6, 0.5); border: none;" />
    </td>
  </tr>
  <tr>
    <td>
      <p style="margin: 0;">Mật khẩu mới của bạn là:</p>
      <div style="background-color: #f0f6d8; padding: 24px 30px; margin: 10px auto; display: inline-block; font-weight: 500;">
        realtan11236199
      </div>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://your-website.com/reset" style="display: inline-block; background-color: #87a706; color: #fff; padding: 16px 32px; border-radius: 16px; text-decoration: none; font-weight: 500; margin-top: 20px;">Đổi mật khẩu tại đây</a>
    </td>
  </tr>
  <tr>
    <td style="background-color: #87a706; color: white; padding: 20px; font-size: 12px; font-family: Montserrat, sans-serif;">
      © 2025 leafy. Tất cả các quyền được bảo lưu.
      <br>
      <a href="https://github.com/Hina845/Leafy_for_researcher_v2" style="margin-right: 10px;"><img src="cid:github" width="32" /></a>
      <a href="https://www.facebook.com/lcdkhoacntt.neu"><img src="cid:facebook" width="32" /></a>
    </td>
  </tr>
</table>

    `
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
if (error) {
    return console.error(error);
}
console.log('Email sent: ' + info.response);
});