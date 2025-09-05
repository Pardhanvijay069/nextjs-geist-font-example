import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/sqlite-database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // For demo purposes, check hardcoded admin credentials first
    if (username === 'admin' && password === 'admin123') {
      // Use demo admin user
      const user = {
        id: 1,
        name: 'Admin User',
        email: 'admin@frameshop.com',
        role: 'admin'
      };

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          username: user.name,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Create response with token in httpOnly cookie
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: user
      });

      // Set httpOnly cookie
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      });

      return response;
    }

    // Check if user exists in database
    const users = executeQuery(
      'SELECT * FROM users WHERE (email = ? OR name = ?) AND role = ?',
      [username, username, 'admin']
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check password for database users
    const isValidPassword = user.password && await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id || 1,
        username: user.name || username,
        role: user.role || 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response with token in httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id || 1,
        name: user.name || username,
        email: user.email || 'admin@frameshop.com',
        role: user.role || 'admin'
      }
    });

    // Set httpOnly cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
