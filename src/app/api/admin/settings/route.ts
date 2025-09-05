import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { executeQuery } from '@/lib/database';

interface CompanySettings {
  name: string;
  logo: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

// GET - Fetch current settings from MySQL database
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (for demo, we'll skip this check)
    // if (!session || (session.user as any)?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Fetch all settings from database
    const settingsResult = await executeQuery(
      'SELECT setting_key, setting_value FROM settings'
    ) as any[];

    // Convert array to object for easier access
    const settings: CompanySettings = {
      name: 'FrameShop',
      logo: 'F',
      description: 'Premium photo frames and art frames',
      email: 'contact@frameshop.com',
      phone: '+91 98765 43210',
      address: '123 Frame Street, Art District, Mumbai 400001'
    };

    // Map database results to settings object
    settingsResult.forEach((row: any) => {
      switch (row.setting_key) {
        case 'company_name':
          settings.name = row.setting_value;
          break;
        case 'company_logo':
          settings.logo = row.setting_value;
          break;
        case 'company_description':
          settings.description = row.setting_value;
          break;
        case 'company_email':
          settings.email = row.setting_value;
          break;
        case 'company_phone':
          settings.phone = row.setting_value;
          break;
        case 'company_address':
          settings.address = row.setting_value;
          break;
      }
    });

    return NextResponse.json({
      success: true,
      settings: settings
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update settings in MySQL database
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (for demo, we'll skip this check)
    // if (!session || (session.user as any)?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { settings } = body;

    // Validate required fields
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Validate individual fields
    const requiredFields = ['name', 'description', 'email'];
    const missingFields = requiredFields.filter(field => !settings[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Update each setting in the database
    const settingsToUpdate = [
      { key: 'company_name', value: settings.name },
      { key: 'company_logo', value: settings.logo || 'F' },
      { key: 'company_description', value: settings.description },
      { key: 'company_email', value: settings.email },
      { key: 'company_phone', value: settings.phone || '' },
      { key: 'company_address', value: settings.address || '' }
    ];

    // Use transaction to ensure all updates succeed or fail together
    await executeQuery('START TRANSACTION');

    try {
      for (const setting of settingsToUpdate) {
        await executeQuery(
          'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
          [setting.value, setting.key]
        );
      }

      await executeQuery('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully',
        settings: {
          name: settings.name,
          logo: settings.logo || 'F',
          description: settings.description,
          email: settings.email,
          phone: settings.phone || '',
          address: settings.address || ''
        }
      });

    } catch (updateError) {
      await executeQuery('ROLLBACK');
      throw updateError;
    }

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Reset settings to defaults
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (for demo, we'll skip this check)
    // if (!session || (session.user as any)?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Default settings
    const defaultSettings = [
      { key: 'company_name', value: 'FrameShop' },
      { key: 'company_logo', value: 'F' },
      { key: 'company_description', value: 'Premium photo frames and art frames' },
      { key: 'company_email', value: 'contact@frameshop.com' },
      { key: 'company_phone', value: '+91 98765 43210' },
      { key: 'company_address', value: '123 Frame Street, Art District, Mumbai 400001' }
    ];

    // Reset all settings to defaults
    await executeQuery('START TRANSACTION');

    try {
      for (const setting of defaultSettings) {
        await executeQuery(
          'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
          [setting.value, setting.key]
        );
      }

      await executeQuery('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Settings reset to defaults successfully',
        settings: {
          name: 'FrameShop',
          logo: 'F',
          description: 'Premium photo frames and art frames',
          email: 'contact@frameshop.com',
          phone: '+91 98765 43210',
          address: '123 Frame Street, Art District, Mumbai 400001'
        }
      });

    } catch (resetError) {
      await executeQuery('ROLLBACK');
      throw resetError;
    }

  } catch (error) {
    console.error('Error resetting settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
