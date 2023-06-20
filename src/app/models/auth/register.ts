/* ------------------- req models ------------------- */
export interface RegisterUserReq {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
