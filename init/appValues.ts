export const signInValues = {
  email: "",
  password: "",
};

export const forgotPasswordValue = {
  email: "",
};

export const resetValue = {
  password: "",
  cPassword: "",
};

export const createChallengeValues = {
  name: "",
  description: "",
  endDate: "",
  image: null,
};

export function getErrorMessage(error: any): string {
  return error?.response?.data?.message || "Something went wrong";
}
