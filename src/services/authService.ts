import { StockUserType } from '../store/authSlice';

const users = [
  {
    name: 'Alexei Sulga',
    email: 'alexxprog@gmail.com',
    bank: 2000,
    itemsPerPage: 20,
    trades: [],
    password: 'password',
  },
  {
    name: 'John Doe',
    email: 'test@example.com',
    bank: 1000,
    itemsPerPage: 10,
    trades: [],
    password: 'test',
  },
];

export async function checkAuthService(email: string, password: string): Promise<StockUserType> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((usr) => usr.email === email && usr.password === password);
      if (!user) {
        throw new Error('User not found');
      }
      resolve(user);
    }, 1000);
  });
}
