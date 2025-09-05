import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'No token found' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.userId,
          name: decoded.username,
          role: decoded.role
        }
      });
    } catch (jwtError) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
