# Design Document

## Overview

Admin Product Integration sistemi, admin paneline yüklenen ürünlerin otomatik olarak web sitesinin ilgili sayfalarına (anasayfa, ürünler sayfası, kategori sayfaları) yüklenmesini sağlar. Sistem, mevcut ürün ve kategori servislerini geliştirerek, gerçek zamanlı senkronizasyon ve kategori bazlı filtreleme özelliklerini ekler.

## Architecture

Sistem, mevcut React frontend ve Supabase backend altyapısını kullanarak aşağıdaki bileşenlerden oluşur:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Panel   │    │  Product Pages  │    │   Supabase DB   │
│                 │    │                 │    │                 │
│ - ProductForm   │◄──►│ - Home          │◄──►│ - products      │
│ - ProductList   │    │ - Products      │    │ - categories    │
│                 │    │ - RibBoat       │    │ - productimages │
└─────────────────┘    │ - Equipment     │    └─────────────────┘
                       └─────────────────┘
                               ▲
                               │
                    ┌─────────────────┐
                    │ Product Service │
                    │                 │
                    │ - CRUD ops      │
                    │ - Real-time     │
                    │ - Caching       │
                    └─────────────────┘
```

## Components and Interfaces

### 1. Enhanced Product Service
Mevcut `productService.js` genişletilecek:

```javascript
interface ProductService {
  // Mevcut metodlar
  getAllProducts(): Promise<Product[]>
  getProductBySlug(slug: string): Promise<Product>
  createProduct(data: ProductData): Promise<Product>
  updateProduct(id: number, data: ProductData): Promise<Product>
  deleteProduct(id: number): Promise<void>
  
  // Yeni metodlar
  getProductsByCategory(categoryId: number): Promise<Product[]>
  getFeaturedProducts(limit: number): Promise<Product[]>
  syncProductsToPages(): Promise<void>
  startRealTimeSync(): void
  stopRealTimeSync(): void
}
```

### 2. Enhanced Category Service
Mevcut `categoryService.js` genişletilecek:

```javascript
interface CategoryService {
  // Mevcut metodlar
  getAllCategories(): Promise<Category[]>
  
  // Yeni metodlar
  getCategoryByName(name: string): Promise<Category>
  getCategoryById(id: number): Promise<Category>
  matchCategoryByIdOrName(identifier: string | number): Promise<Category>
}
```

### 3. Page Components
Mevcut sayfa bileşenleri güncellenecek:

- **Home.jsx**: Öne çıkan ürünler için enhanced loading
- **Products.jsx**: Tüm ürünler için real-time sync
- **RibBoat.jsx**: Kategori bazlı filtreleme
- **Equipment.jsx**: Kategori bazlı filtreleme

## Data Models

### Product Model (Enhanced)
```javascript
interface Product {
  ProductID: number
  ProductName: string
  Slug: string
  CategoryID: number
  Categories: Category
  ShortDescription: string
  Description: string
  Specifications: ProductSpecifications
  Price: number
  Stock: number
  IsActive: boolean
  CreatedDate: string
  ProductImages: ProductImage[]
  
  // Computed fields
  categoryName: string
  formattedPrice: string
  displaySpecs: DisplaySpecifications
}
```

### Category Model (Enhanced)
```javascript
interface Category {
  categoryID: number
  name: string
  slug: string
  description: string
  parentID?: number
  
  // Computed fields
  productCount: number
  isActive: boolean
}
```

### Product Specifications (Enhanced)
```javascript
interface ProductSpecifications {
  type: 'Sale' | 'Rent'
  
  // Rib Boat specific
  width?: string
  length?: string
  weight?: string
  passengerCapacity?: string
  emptyWeight?: string
  fullWeight?: string
  enginePower?: string
  
  // Equipment specific
  brand?: string
  model?: string
  condition?: 'new' | 'used' | 'refurbished'
  warranty?: string
  
  // General
  [key: string]: any
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Product Creation Persistence
*For any* valid product data, when a product is created through the admin panel, the product should be successfully stored in the database and retrievable
**Validates: Requirements 1.1**

### Property 2: Category-Based Product Display
*For any* product with a valid category, when the product is saved, it should appear on the corresponding category page based on its category assignment
**Validates: Requirements 1.2**

### Property 3: Product Update Consistency
*For any* existing product, when product data is updated, the changes should be reflected consistently across all pages where the product appears
**Validates: Requirements 1.3**

### Property 4: Product Deactivation Removal
*For any* product, when the product is deleted or deactivated, it should no longer appear on any public page
**Validates: Requirements 1.4**

### Property 5: Real-time Synchronization
*For any* product data change, the change should be propagated to all relevant pages within the specified time limit
**Validates: Requirements 1.5**

### Property 6: Featured Products Display
*For any* set of products, when the home page loads, it should display the 3 most recently created active products in the featured section
**Validates: Requirements 2.1**

### Property 7: Featured Products Update
*For any* new product addition, the home page featured products list should be updated to include the new product if it qualifies
**Validates: Requirements 2.2**

### Property 8: Product Information Completeness
*For any* product displayed on any page, the product should show all required information fields (name, price, image, specifications)
**Validates: Requirements 2.3, 3.3**

### Property 9: Product Navigation
*For any* product link, clicking on the product should navigate to the correct product detail page
**Validates: Requirements 2.4**

### Property 10: Active Products Filter
*For any* product list page, only products with IsActive=true should be displayed to users
**Validates: Requirements 3.1, 3.2**

### Property 11: Product Filtering
*For any* filter criteria applied on the products page, the results should contain only products that match the specified criteria
**Validates: Requirements 3.4**

### Property 12: Rib Boat Category Filter
*For any* product list, when displayed on the Rib Boat page, only products with CategoryID=1 or category name="Rib Boat" should be shown
**Validates: Requirements 4.1, 4.2**

### Property 13: Rib Boat Specifications Display
*For any* Rib Boat product, when displayed, it should show Rib Boat specific specifications (width, length, weight, capacity, engine power)
**Validates: Requirements 4.3**

### Property 14: Equipment Category Filter
*For any* product list, when displayed on the Equipment page, only products with CategoryID=2 or category name="Malzeme ve Ekipmanlar" should be shown
**Validates: Requirements 5.1, 5.2**

### Property 15: Equipment Specifications Display
*For any* Equipment product, when displayed, it should show equipment specific specifications (brand, model, condition, warranty)
**Validates: Requirements 5.3**

### Property 16: Category Matching
*For any* category identifier (ID or name), the system should correctly match and return the corresponding category information
**Validates: Requirements 6.1, 6.3**

### Property 17: Category Routing
*For any* product with a valid category, the product should appear on the correct category-specific page
**Validates: Requirements 6.2**

### Property 18: Fallback Category Handling
*For any* product with an invalid or missing category, the product should appear on the general products page
**Validates: Requirements 6.4**

### Property 19: Sync Optimization
*For any* synchronization operation, only changed data should be updated, not the entire dataset
**Validates: Requirements 7.2**

### Property 20: Error Resilience
*For any* synchronization error, the system should maintain existing data and log the error without crashing
**Validates: Requirements 7.3**

### Property 21: Cache-First Loading
*For any* page load, data should be loaded first from cache, then updated from the database
**Validates: Requirements 7.4**

## Error Handling

### 1. Database Connection Errors
- Fallback to cached data
- Display user-friendly error messages
- Retry mechanism with exponential backoff

### 2. Category Mismatch Errors
- Default to general products page
- Log category mismatch for admin review
- Maintain product visibility

### 3. Image Loading Errors
- Fallback to placeholder images
- Graceful degradation of UI
- Continue displaying other product information

### 4. Synchronization Errors
- Maintain current state
- Queue failed operations for retry
- Alert admin of persistent failures

## Testing Strategy

### Unit Testing
- Test individual service methods
- Test component rendering with mock data
- Test error handling scenarios
- Test category matching logic

### Property-Based Testing
Property-based tests will be implemented using **fast-check** library for JavaScript/React applications. Each property-based test will run a minimum of 100 iterations to ensure comprehensive coverage.

Each property-based test must be tagged with a comment explicitly referencing the correctness property in the design document using this format: '**Feature: admin-product-integration, Property {number}: {property_text}**'

### Integration Testing
- Test admin panel to page synchronization
- Test real-time updates across multiple pages
- Test category-based filtering end-to-end
- Test error recovery scenarios

### Performance Testing
- Test synchronization performance with large datasets
- Test page load times with many products
- Test memory usage during real-time updates