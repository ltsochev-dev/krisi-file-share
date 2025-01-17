- Implement reCAPTCHA or similar on the homepage

- Implement Request Upload URL button from homepage using shadcn/ui Dialog

  - Should ask for name, email, short description
  - Should validate against robots (recaptcha, verify human)
  - Should send email to `process.env.SUPPORT_MAIL`

- Refactor the homepage to allow guests to login but block access off of the admin panel

  - If they are logged in, don't ask for name/email in the dialog - we could reuse data from the user object

- Once an upload URL is generated in the admin panel - send plaintext email to the customer with the link from `process.env.MAIL_FROM_ADDRESS`
