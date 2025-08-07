import * as y from "yup";

export const register_schema = y.object().shape({
  username: y.string().required(),
  password1: y.string().required(),
  password2: y
    .string()
    .oneOf([y.ref("password1"), null], "Passwords must match")
    .required(),
  email: y.string().required(),
  bio: y.string(),
});

export const login_schema = y.object().shape({
  username: y.string().required(),
  password: y.string().required(),
});

export const forgot_password_schema = y.object().shape({
  username: y.string().required(),
  email: y.string().required(),
});

export const set_password_schema = y.object().shape({
  password1: y.string().required(),
  password2: y
    .string()
    .oneOf([y.ref("password1"), null], "Passwords must match")
    .required(),
});

export default {
  register_schema,
  login_schema,
  forgot_password_schema,
  set_password_schema,
};
