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

export default {
  register_schema,
};
