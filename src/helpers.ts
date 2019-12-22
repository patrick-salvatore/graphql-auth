export const validateEmail = (email: string) => {
  const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;
  
  if (emailRegex.test(email)) {
    return true;
  }
  
  throw new Error("not valid email");
};

export const validatePassword = (password: string) => {
  if (password.length > 6) {
    return true;
  }

  throw new Error("password is not long enough");
};
