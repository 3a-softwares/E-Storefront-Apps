import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Modal, Input, Textarea, Select } from '@3asoftwares/ui';
import { productApi, handleApiError } from '../api/client';
import { useSellerAuthStore } from '../store/authStore';
import { useCategoryStore } from '../store/categoryStore';
import { ImageUpload } from '../components/ImageUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  sellerId: string;
  isActive: boolean;
}

export const SellerProducts: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSellerAuthStore();
  const { fetchCategories, getCategoryOptions } = useCategoryStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: '',
  });

  const fetchProducts = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const response = await productApi.getBySeller(user.id);
      setProducts(response?.data?.products || []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [user?.id, fetchCategories]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
    });
    setIsEditModalOpen(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setIsUpdating(true);
      setError(null);

      await productApi.update(editingProduct._id, {
        ...formData,
        sellerId: user?.id || editingProduct.sellerId,
      });

      setIsEditModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await productApi.delete(id);
      fetchProducts();
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh_-_150px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">My Products</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Manage your product inventory ({products?.length || 0} products)
          </p>
        </div>
        <Button className="!w-auto text-sm sm:text-base" onClick={() => navigate('/products/new')}>
          <FontAwesomeIcon icon={faPlus} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Add New</span> Product
        </Button>
      </div>

      {products && products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📦</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Start by adding your first product</p>
          <Button onClick={() => navigate('/products/new')} className="text-sm sm:text-base">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Your First Product
          </Button>
        </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products?.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                    📦
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Inactive
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-800'
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(product)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDelete(product._id, product.name)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Input
          type="text"
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Enter product name"
        />
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
          placeholder="Describe your product..."
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="number"
              step="0.01"
              label="Price (₹)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
              placeholder="0.00"
            />
          </div>
          <div>
            <Input
              type="number"
              label="Stock Quantity"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              required
              placeholder="0"
            />
          </div>
        </div>
        <div className="mb-4">
          <Select
            label="Category"
            className="w-full"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={getCategoryOptions()}
            placeholder="Select a category"
          />
        </div>
        <ImageUpload
          currentImage={formData.imageUrl}
          onImageUpload={(imageUrl) => setFormData({ ...formData, imageUrl })}
          onRemove={() => setFormData({ ...formData, imageUrl: '' })}
        />

        <div className="flex gap-3 pt-4">
          <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isUpdating} onClick={handleSubmit}>
            {isUpdating ? 'Updating...' : 'Update Product'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
