import { Product } from '@/contexts/CartContext';

export const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Classic Wooden Frame',
    price: 29.99,
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/64b42720-6c1e-4450-a1f1-4a30e5d605e8.png',
    description: 'Beautiful handcrafted wooden frame perfect for family photos and artwork. Made from premium oak wood with a smooth finish.',
    category: 'wooden',
    stock: 15,
    sizes: ['4x6', '5x7', '8x10', '11x14'],
    specifications: {
      'Material': 'Premium Oak Wood',
      'Finish': 'Natural Wood Stain',
      'Mounting': 'Wall Mount & Table Stand',
      'Glass': 'Anti-Glare Glass'
    },
    reviews: [
      {
        id: '1',
        user: 'Sarah Johnson',
        rating: 5,
        comment: 'Absolutely beautiful frame! The wood quality is exceptional and it looks perfect in my living room.',
        date: '2024-01-15'
      },
      {
        id: '2',
        user: 'Mike Chen',
        rating: 4,
        comment: 'Great quality frame, though a bit pricey. The craftsmanship is excellent.',
        date: '2024-01-10'
      },
      {
        id: '3',
        user: 'Emily Davis',
        rating: 5,
        comment: 'Love the natural wood finish. Perfect for my family photos!',
        date: '2024-01-08'
      }
    ]
  },
  {
    id: '2',
    title: 'Modern Metal Frame',
    price: 39.99,
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c787d7e7-cec9-4e0c-93cf-03ffe4547cec.png',
    description: 'Sleek and modern metal frame with a minimalist design. Perfect for contemporary home decor and professional displays.',
    category: 'metal',
    stock: 20,
    sizes: ['5x7', '8x10', '11x14', '16x20'],
    specifications: {
      'Material': 'Brushed Aluminum',
      'Finish': 'Matte Black',
      'Mounting': 'Wall Mount Only',
      'Glass': 'Crystal Clear Glass'
    },
    reviews: [
      {
        id: '4',
        user: 'Alex Rodriguez',
        rating: 5,
        comment: 'Perfect minimalist design! Looks amazing with my modern decor.',
        date: '2024-01-12'
      },
      {
        id: '5',
        user: 'Lisa Wang',
        rating: 4,
        comment: 'Great quality metal frame. Very sleek and professional looking.',
        date: '2024-01-09'
      }
    ]
  },
  {
    id: '3',
    title: 'Vintage Ornate Frame',
    price: 49.99,
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/778dc11a-072f-45bf-8f41-3720ceb3d1f1.png',
    description: 'Elegant vintage-style frame with intricate ornate details. Adds a touch of classic sophistication to any space.',
    category: 'vintage',
    stock: 8,
    sizes: ['5x7', '8x10', '11x14'],
    specifications: {
      'Material': 'Carved Wood with Gold Leaf',
      'Finish': 'Antique Gold',
      'Mounting': 'Wall Mount & Table Stand',
      'Glass': 'Museum Quality Glass'
    },
    reviews: [
      {
        id: '6',
        user: 'Margaret Thompson',
        rating: 5,
        comment: 'Absolutely stunning! The intricate details are breathtaking. Perfect for my antique collection.',
        date: '2024-01-14'
      },
      {
        id: '7',
        user: 'Robert Kim',
        rating: 4,
        comment: 'Beautiful ornate design, though quite heavy. The gold finish is gorgeous.',
        date: '2024-01-11'
      }
    ]
  },
  {
    id: '4',
    title: 'Floating Glass Frame',
    price: 34.99,
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/475775bf-ecd9-4108-8978-8315e3425b9b.png',
    description: 'Contemporary floating glass frame that creates a stunning display effect. Perfect for certificates and special photos.',
    category: 'glass',
    stock: 12,
    sizes: ['8x10', '11x14', '16x20'],
    specifications: {
      'Material': 'Tempered Glass',
      'Finish': 'Clear Glass',
      'Mounting': 'Wall Mount Only',
      'Glass': 'Double Layer Glass'
    },
    reviews: [
      {
        id: '8',
        user: 'Jennifer Lee',
        rating: 5,
        comment: 'Love the floating effect! Perfect for my certificates and awards.',
        date: '2024-01-13'
      }
    ]
  },
  {
    id: '5',
    title: 'Rustic Barn Wood Frame',
    price: 44.99,
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d90520d1-4606-475a-ac52-95e777d9344e.png',
    description: 'Authentic rustic barn wood frame with natural weathered texture. Brings warmth and character to any room.',
    category: 'rustic',
    stock: 10,
    sizes: ['5x7', '8x10', '11x14', '16x20'],
    specifications: {
      'Material': 'Reclaimed Barn Wood',
      'Finish': 'Natural Weathered',
      'Mounting': 'Wall Mount & Table Stand',
      'Glass': 'Standard Glass'
    },
    reviews: [
      {
        id: '9',
        user: 'Tom Wilson',
        rating: 5,
        comment: 'Authentic rustic look! The weathered texture is perfect for my farmhouse decor.',
        date: '2024-01-07'
      },
      {
        id: '10',
        user: 'Anna Martinez',
        rating: 4,
        comment: 'Beautiful rustic frame, adds great character to my photos.',
        date: '2024-01-05'
      }
    ]
  },
  {
    id: '6',
    title: 'Digital LED Frame',
    price: 199.99,
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/74b1bb47-7e7c-4096-852f-ba223b6ee70f.png',
    description: 'Smart digital frame with LED display. WiFi enabled for easy photo sharing and slideshow features.',
    category: 'digital',
    stock: 5,
    sizes: ['10 inch', '15 inch', '21 inch'],
    specifications: {
      'Display': 'LED Touchscreen',
      'Resolution': '1920x1080 Full HD',
      'Connectivity': 'WiFi, Bluetooth, USB',
      'Storage': '16GB Internal + Cloud'
    },
    reviews: [
      {
        id: '11',
        user: 'David Park',
        rating: 5,
        comment: 'Amazing digital frame! Easy to set up and the picture quality is excellent.',
        date: '2024-01-06'
      },
      {
        id: '12',
        user: 'Rachel Green',
        rating: 4,
        comment: 'Great for sharing family photos remotely. Kids love updating it from their phones.',
        date: '2024-01-04'
      }
    ]
  },
  {
    id: '7',
    title: 'Collage Multi-Photo Frame',
    price: 54.99,
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ec3ffff7-f5f2-4c50-aeb9-8388a1026b72.png',
    description: 'Beautiful collage frame that holds multiple photos. Perfect for displaying family memories and special moments.',
    category: 'collage',
    stock: 18,
    sizes: ['4 Photos (4x6)', '6 Photos (4x6)', '9 Photos (4x6)'],
    specifications: {
      'Material': 'MDF with Veneer',
      'Finish': 'White or Black',
      'Mounting': 'Wall Mount Only',
      'Glass': 'Standard Glass'
    },
    reviews: [
      {
        id: '13',
        user: 'Susan Brown',
        rating: 5,
        comment: 'Perfect for displaying family memories! Love having multiple photos in one frame.',
        date: '2024-01-03'
      }
    ]
  },
  {
    id: '8',
    title: 'Shadow Box Frame',
    price: 64.99,
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3e647779-7bdc-40d2-9c8b-8399ff764093.png',
    description: 'Deep shadow box frame perfect for displaying memorabilia, medals, and three-dimensional keepsakes.',
    category: 'shadow-box',
    stock: 7,
    sizes: ['8x10x2', '11x14x2', '16x20x3'],
    specifications: {
      'Material': 'Solid Wood',
      'Depth': '2-3 inches',
      'Mounting': 'Wall Mount Only',
      'Glass': 'UV Protection Glass'
    },
    reviews: [
      {
        id: '14',
        user: 'Michael Johnson',
        rating: 5,
        comment: 'Perfect for displaying my military medals and memorabilia. Great depth and quality.',
        date: '2024-01-02'
      },
      {
        id: '15',
        user: 'Linda Davis',
        rating: 4,
        comment: 'Excellent for 3D displays. Used it for my son\'s sports achievements.',
        date: '2024-01-01'
      }
    ]
  }
];

export const categories = [
  { id: 'wooden', name: 'Wooden Frames', count: 2 },
  { id: 'metal', name: 'Metal Frames', count: 1 },
  { id: 'vintage', name: 'Vintage Frames', count: 1 },
  { id: 'glass', name: 'Glass Frames', count: 1 },
  { id: 'rustic', name: 'Rustic Frames', count: 1 },
  { id: 'digital', name: 'Digital Frames', count: 1 },
  { id: 'collage', name: 'Collage Frames', count: 1 },
  { id: 'shadow-box', name: 'Shadow Box', count: 1 }
];
