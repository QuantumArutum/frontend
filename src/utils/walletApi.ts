export const createWallet = async (password: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (password === 'testpassword') {
        resolve({ success: false, error: 'Password is too common.' });
      } else {
        resolve({ success: true });
      }
    }, 1000);
  });
};
