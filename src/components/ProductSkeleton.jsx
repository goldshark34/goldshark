import { Card, Col } from 'react-bootstrap'

const ProductSkeleton = () => {
  return (
    <Col lg={4} md={6}>
      <Card className="h-100 border-0 shadow-sm overflow-hidden">
        {/* Image Skeleton */}
        <div 
          className="skeleton-image"
          style={{ 
            height: '280px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s infinite'
          }}
        />
        
        <Card.Body className="p-4">
          {/* Title Skeleton */}
          <div 
            className="skeleton-title mb-3"
            style={{
              height: '24px',
              width: '80%',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'loading 1.5s infinite',
              borderRadius: '4px'
            }}
          />
          
          {/* Specs Skeleton */}
          <div className="mb-3">
            {[1, 2, 3].map(i => (
              <div 
                key={i}
                className="skeleton-spec mb-2"
                style={{
                  height: '16px',
                  width: `${60 + (i * 10)}%`,
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'loading 1.5s infinite',
                  borderRadius: '4px',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          
          <hr className="my-3" />
          
          {/* Price and Button Skeleton */}
          <div className="d-flex justify-content-between align-items-center">
            <div 
              className="skeleton-price"
              style={{
                height: '20px',
                width: '40%',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s infinite',
                borderRadius: '4px'
              }}
            />
            <div 
              className="skeleton-button"
              style={{
                height: '38px',
                width: '100px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s infinite',
                borderRadius: '6px'
              }}
            />
          </div>
        </Card.Body>
      </Card>
      
      <style>{`
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </Col>
  )
}

// Multiple skeletons for grid
export const ProductSkeletonGrid = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </>
  )
}

export default ProductSkeleton