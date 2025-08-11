import * as y from "yup";

export const register_schema = y.object().shape({
  username: y
    .string()
    .matches(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric")
    .required(),
  password1: y.string().required(),
  password2: y
    .string()
    .oneOf([y.ref("password1"), null], "Passwords must match")
    .required(),
  email: y.string().email("Invalid email").required(),
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

export const comment_schema = y.object().shape({
  postID: y.string().required(),
  text: y.string().max(1000).required(),
});

export default {
  register_schema,
  login_schema,
  forgot_password_schema,
  comment_schema,
  set_password_schema,
};
