import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'student';
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Demo users - In production, this would be handled by a proper backend
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@university.edu',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'student@university.edu',
    password: 'student123',
    role: 'student' as const,
  },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    const user = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    set({ user: userWithoutPassword });

    // Redirect based on role
    window.location.href = user.role === 'admin' ? '/admin' : '/dashboard';
  },
  logout: () => {
    set({ user: null });
    window.location.href = '/';
  },
}));