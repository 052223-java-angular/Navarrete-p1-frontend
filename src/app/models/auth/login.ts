/* ------------------- res modesl ------------------- */
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
