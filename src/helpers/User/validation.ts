const validateEmail = (email: string) => {
  const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;
  
  if (emailRegex.test(email)) {
    return true;
  }
  
  return false; 
};

const validatePassword = (password: string) => {
  if (password.length > 6) {
    return true;
  }

  return false;
};

const validateUserName = (userName: string) => {
  const userNameRegex = /^[a-z0-9_-]{3,15}$/
  
  if (userNameRegex.test(userName)) {
    return true;
  }
  
  return false;
}

export const validateUserCredentials = ({userName, email, password}: {userName: string, email: string, password: string}) => {
  switch (true) {
    case !validateUserName(userName): {
      throw new Error("Username must have: a length from 3-15 and characters from a-z, underscore, or hyphen");
    }
    case !validateEmail(email): {
      throw new Error("Not valid email");
    }
    case !validatePassword(password): {
      throw new Error("Password must atleast 6 characters");
    }
    default: 
      return true;
  }
}