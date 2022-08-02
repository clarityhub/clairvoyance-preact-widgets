export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(.+){8,}$/;
  return re.test(password);
};
