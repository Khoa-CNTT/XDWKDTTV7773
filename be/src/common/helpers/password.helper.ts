import * as bcrypt from 'bcrypt';

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (
  plainPassword: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hash);
};
