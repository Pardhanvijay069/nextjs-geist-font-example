import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { executeQuery } from './database';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Get user from database
          const users = await executeQuery(
            'SELECT * FROM users WHERE email = ?',
            [credentials.email]
          ) as any[];

          if (users.length === 0) {
            return null;
          }

          const user = users[0];

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

// Helper functions for user management
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const createUser = async (userData: {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user';
  phone?: string;
  address?: string;
}) => {
  try {
    const hashedPassword = await hashPassword(userData.password);
    
    const result = await executeQuery(
      `INSERT INTO users (email, password, name, role, phone, address) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userData.email,
        hashedPassword,
        userData.name,
        userData.role || 'user',
        userData.phone || null,
        userData.address || null,
      ]
    );

    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const getUserById = async (id: string) => {
  try {
    const users = await executeQuery(
      'SELECT id, email, name, role, phone, address, created_at FROM users WHERE id = ?',
      [id]
    ) as any[];

    return users[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to get user');
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const users = await executeQuery(
      'SELECT id, email, name, role, phone, address, created_at FROM users WHERE email = ?',
      [email]
    ) as any[];

    return users[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw new Error('Failed to get user');
  }
};

export const updateUser = async (id: string, userData: {
  name?: string;
  phone?: string;
  address?: string;
}) => {
  try {
    const updates = [];
    const values = [];

    if (userData.name) {
      updates.push('name = ?');
      values.push(userData.name);
    }
    if (userData.phone) {
      updates.push('phone = ?');
      values.push(userData.phone);
    }
    if (userData.address) {
      updates.push('address = ?');
      values.push(userData.address);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const result = await executeQuery(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};
