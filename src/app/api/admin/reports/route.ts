import { NextRequest, NextResponse } from 'next/server';

// Mock data for reports (in production, this would come from database)
const generateMockSalesData = () => {
  const salesData = [];
  const today = new Date();
  
  for (let i = 14; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    salesData.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 3000) + 1000,
      orders: Math.floor(Math.random() * 20) + 5,
      customers: Math.floor(Math.random() * 15) + 3
    });
  }
  
  return salesData;
};

const mockProductPerformance = [
  { name: 'Classic Wooden Frame', sales: 45, revenue: 1349.55, stock: 12 },
  { name: 'Modern Metal Frame', sales: 38, revenue: 1519.62, stock: 8 },
  { name: 'Digital LED Frame', sales: 22, revenue: 3299.78, stock: 3 },
  { name: 'Vintage Ornate Frame', sales: 31, revenue: 1549.69, stock: 15 },
  { name: 'Floating Glass Frame', sales: 18, revenue: 1799.82, stock: 6 },
  { name: 'Collage Multi-Photo Frame', sales: 25, revenue: 1499.75, stock: 10 }
];

const mockOrderStatusData = [
  { status: 'Delivered', count: 45, color: '#10B981' },
  { status: 'Processing', count: 12, color: '#3B82F6' },
  { status: 'Shipped', count: 8, color: '#8B5CF6' },
  { status: 'Pending', count: 6, color: '#F59E0B' },
  { status: 'Cancelled', count: 3, color: '#EF4444' }
];

const mockCustomerAnalytics = [
  { type: 'New Customers', count: 28, percentage: 65 },
  { type: 'Returning Customers', count: 15, percentage: 35 }
];

// GET /api/admin/reports - Get reports data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'dashboard';
    const period = searchParams.get('period') || '30days';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    switch (reportType) {
      case 'dashboard':
        return getDashboardReport(period);
      
      case 'sales':
        return getSalesReport(startDate, endDate, period);
      
      case 'products':
        return getProductsReport(period);
      
      case 'customers':
        return getCustomersReport(period);
      
      case 'orders':
        return getOrdersReport(period);
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid report type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// Dashboard report with overview metrics
function getDashboardReport(period: string) {
  const salesData = generateMockSalesData();
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100
      },
      salesData,
      productPerformance: mockProductPerformance,
      orderStatusData: mockOrderStatusData,
      customerAnalytics: mockCustomerAnalytics,
      period
    }
  });
}

// Sales report with detailed analytics
function getSalesReport(startDate: string | null, endDate: string | null, period: string) {
  const salesData = generateMockSalesData();
  
  // Filter by date range if provided
  let filteredData = salesData;
  if (startDate && endDate) {
    filteredData = salesData.filter(item => 
      item.date >= startDate && item.date <= endDate
    );
  }

  const totalRevenue = filteredData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = filteredData.reduce((sum, day) => sum + day.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate growth (mock data)
  const revenueGrowth = Math.floor(Math.random() * 20) + 5; // 5-25% growth
  const ordersGrowth = Math.floor(Math.random() * 15) + 3; // 3-18% growth

  return NextResponse.json({
    success: true,
    data: {
      period: {
        startDate: startDate || filteredData[0]?.date,
        endDate: endDate || filteredData[filteredData.length - 1]?.date,
        period
      },
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        revenueGrowth,
        ordersGrowth
      },
      salesData: filteredData,
      topProducts: mockProductPerformance.slice(0, 5)
    }
  });
}

// Products performance report
function getProductsReport(period: string) {
  const topProducts = [...mockProductPerformance].sort((a, b) => b.sales - a.sales);
  const lowStockProducts = mockProductPerformance.filter(p => p.stock < 10);
  
  return NextResponse.json({
    success: true,
    data: {
      topProducts,
      lowStockProducts,
      totalProducts: mockProductPerformance.length,
      totalSales: mockProductPerformance.reduce((sum, p) => sum + p.sales, 0),
      totalRevenue: mockProductPerformance.reduce((sum, p) => sum + p.revenue, 0),
      period
    }
  });
}

// Customers analytics report
function getCustomersReport(period: string) {
  const totalCustomers = 156;
  const newCustomers = 28;
  const returningCustomers = 15;
  const customerGrowth = Math.floor(Math.random() * 25) + 10; // 10-35% growth

  // Customer segments by spending
  const customerSegments = [
    { segment: 'High Value (₹10,000+)', count: 12, percentage: 7.7 },
    { segment: 'Medium Value (₹5,000-₹10,000)', count: 34, percentage: 21.8 },
    { segment: 'Low Value (<₹5,000)', count: 110, percentage: 70.5 }
  ];

  // Customer acquisition channels
  const acquisitionChannels = [
    { channel: 'Website', count: 89, percentage: 57.1 },
    { channel: 'Social Media', count: 45, percentage: 28.8 },
    { channel: 'Referral', count: 15, percentage: 9.6 },
    { channel: 'Other', count: 7, percentage: 4.5 }
  ];

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalCustomers,
        newCustomers,
        returningCustomers,
        customerGrowth,
        averageOrderValue: 187.50,
        customerLifetimeValue: 425.30
      },
      customerAnalytics: mockCustomerAnalytics,
      customerSegments,
      acquisitionChannels,
      period
    }
  });
}

// Orders analytics report
function getOrdersReport(period: string) {
  const totalOrders = mockOrderStatusData.reduce((sum, status) => sum + status.count, 0);
  const completedOrders = mockOrderStatusData.find(s => s.status === 'Delivered')?.count || 0;
  const completionRate = (completedOrders / totalOrders) * 100;

  // Order trends by day of week
  const ordersByDay = [
    { day: 'Monday', orders: 12, revenue: 2340 },
    { day: 'Tuesday', orders: 15, revenue: 2890 },
    { day: 'Wednesday', orders: 18, revenue: 3450 },
    { day: 'Thursday', orders: 14, revenue: 2670 },
    { day: 'Friday', orders: 20, revenue: 3890 },
    { day: 'Saturday', orders: 25, revenue: 4560 },
    { day: 'Sunday', orders: 16, revenue: 3120 }
  ];

  // Average processing time (mock data)
  const processingTimes = {
    averageProcessingTime: '2.3 days',
    averageShippingTime: '3.1 days',
    averageDeliveryTime: '5.4 days'
  };

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalOrders,
        completedOrders,
        completionRate: Math.round(completionRate * 100) / 100,
        cancelledOrders: mockOrderStatusData.find(s => s.status === 'Cancelled')?.count || 0,
        pendingOrders: mockOrderStatusData.find(s => s.status === 'Pending')?.count || 0
      },
      orderStatusData: mockOrderStatusData,
      ordersByDay,
      processingTimes,
      period
    }
  });
}

// POST /api/admin/reports - Generate custom report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportType, filters, dateRange } = body;

    // Validate request
    if (!reportType) {
      return NextResponse.json(
        { success: false, error: 'Report type is required' },
        { status: 400 }
      );
    }

    // Generate custom report based on filters
    const customReport = {
      reportType,
      generatedAt: new Date().toISOString(),
      filters,
      dateRange,
      data: generateCustomReportData(reportType, filters)
    };

    return NextResponse.json({
      success: true,
      data: customReport
    });
  } catch (error) {
    console.error('Error generating custom report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate custom report' },
      { status: 500 }
    );
  }
}

// Generate custom report data based on type and filters
function generateCustomReportData(reportType: string, filters: any) {
  switch (reportType) {
    case 'revenue_by_category':
      return [
        { category: 'Photo Frames', revenue: 15420, orders: 89 },
        { category: 'Art Frames', revenue: 12340, orders: 67 },
        { category: 'Digital Frames', revenue: 8950, orders: 34 },
        { category: 'Wall Frames', revenue: 6780, orders: 45 },
        { category: 'Vintage Frames', revenue: 5670, orders: 28 }
      ];
    
    case 'customer_lifetime_value':
      return [
        { segment: 'VIP Customers', averageLTV: 1250, count: 15 },
        { segment: 'Regular Customers', averageLTV: 450, count: 67 },
        { segment: 'New Customers', averageLTV: 180, count: 89 }
      ];
    
    case 'inventory_turnover':
      return mockProductPerformance.map(product => ({
        ...product,
        turnoverRate: Math.round((product.sales / product.stock) * 100) / 100,
        daysInStock: Math.floor(Math.random() * 60) + 10
      }));
    
    default:
      return { message: 'Custom report data not available for this type' };
  }
}
