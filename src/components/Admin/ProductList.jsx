import React from 'react'
import { Table, Button } from 'react-bootstrap'

const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <div className="product-list">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ürün Adı</th>
            <th>Kategori</th>
            <th>Fiyat</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Henüz ürün bulunmamaktadır.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.ProductID || product.productID}>
                <td>{product.ProductID || product.productID}</td>
                <td>{product.ProductName || product.name || product.productName}</td>
                <td>{product.Categories?.name || product.categoryName || 'Kategori Yok'}</td>
                <td>{product.Price || product.price ? `${parseFloat(product.Price || product.price).toLocaleString('tr-TR')} €` : 'Belirtilmemiş'}</td>
                <td>
                  <span className={`badge ${(product.IsActive !== false && product.isActive !== false) ? 'bg-success' : 'bg-secondary'}`}>
                    {(product.IsActive !== false && product.isActive !== false) ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(product)}
                  >
                    ✏️ Düzenle
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(product.ProductID || product.productID)}
                  >
                    🗑️ Sil
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default ProductList
