/* ------------------- req models ------------------- */
export interface registerUserReq {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface loginUserReq {
  username: string;
  password: string;
}

/* ------------------- res modesl ------------------- */
export interface loginUserRes {
  id: string;
  username: string;
  role: string;
  token: string;
}
