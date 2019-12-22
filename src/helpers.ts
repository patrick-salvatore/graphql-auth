export const validateEmail = (email: string) => {
  const emailRegex = /\w+@\w+\.\w(2,4)/i;

  if (emailRegex.test(email)) {
    return true
  }

  throw new Error('not valid email')
};

export const validatePassword = (password: string) => {
  if (password.length > 6) {
    return true
  }

  throw new Error('password is not long enough')
}