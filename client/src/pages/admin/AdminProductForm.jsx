import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './AdminProductForm.css';

// Badges predefinidos como sugerencias
const BADGE_SUGGESTIONS = ['Nuevo', 'OFERTA', 'Popular', 'Premium', 'Pack x3', 'Pack x5', 'Pack x10', 'Limited', 'Hot'];

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '',
    amount: '',
    category: '',
    categoryBg: '#8DC63F',
    categoryColor: '#fff',
    description: '',
    badge: '',
    badgeBg: '#8DC63F',
    badgeColor: '#fff',
    image: '/images/producto_gen.webp',
    image2: '',
    image3: '',
    variants: ['Standard']
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [variantInput, setVariantInput] = useState('');
  
  // Estados para categorías dinámicas
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  // Estados para subida de imágenes
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://entre-nubes-ten.vercel.app';

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categorias`);
      if (response.ok) {
        const cats = await response.json();
        setCategories(cats);
        // Si no hay categoría seleccionada y hay categorías disponibles, seleccionar la primera
        if (!formData.category && cats.length > 0) {
          setFormData(prev => ({ ...prev, category: cats[0] }));
        }
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/productos/${id}`);
      if (!response.ok) throw new Error('Producto no encontrado');
      const product = await response.json();
      
      setFormData({
        ...product,
        price: product.price.toString(),
        discount: product.discount?.toString() || '',
        amount: product.amount.toString()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar que sea WebP
    if (!file.name.endsWith('.webp')) {
      setUploadError('Solo se permiten imágenes en formato WebP');
      return;
    }

    setUploadingImage(true);
    setUploadError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBadgeTextChange = (e) => {
    setFormData(prev => ({ ...prev, badge: e.target.value }));
  };

  const handleBadgeColorChange = (colorType, value) => {
    setFormData(prev => ({ ...prev, [colorType]: value }));
  };

  const applyBadgeSuggestion = (suggestion) => {
    // Colores predefinidos según el tipo de badge
    const colorMap = {
      'Nuevo': { bg: '#D3FF0B', color: '#000' },
      'OFERTA': { bg: '#FF3913', color: '#fff' },
      'Popular': { bg: '#8DC63F', color: '#fff' },
      'Premium': { bg: '#000', color: '#D3FF0B' },
      'Pack x3': { bg: '#8DC63F', color: '#fff' },
      'Pack x5': { bg: '#8DC63F', color: '#fff' },
      'Pack x10': { bg: '#8DC63F', color: '#fff' },
      'Limited': { bg: '#FF3913', color: '#fff' },
      'Hot': { bg: '#FF3913', color: '#fff' }
    };

    const colors = colorMap[suggestion] || { bg: '#8DC63F', color: '#fff' };
    
    setFormData(prev => ({
      ...prev,
      badge: suggestion,
      badgeBg: colors.bg,
      badgeColor: colors.color
    }));
  };

  const handleCategoryColorChange = (colorType, value) => {
    setFormData(prev => ({ ...prev, [colorType]: value }));
  };

  const applyCategorySuggestion = (categoryName) => {
    // Colores predefinidos para categorías comunes
    const categoryColorMap = {
      'Pipas': { bg: '#8DC63F', color: '#fff' },
      'Molinillos': { bg: '#D3FF0B', color: '#000' },
      'Papeles': { bg: '#FF3913', color: '#fff' },
      'Vaporizadores': { bg: '#000', color: '#D3FF0B' },
      'Almacenamiento': { bg: '#8DC63F', color: '#fff' },
      'Encendedores': { bg: '#FF3913', color: '#fff' },
      'Accesorios': { bg: '#8DC63F', color: '#fff' }
    };

    const colors = categoryColorMap[categoryName] || { bg: '#8DC63F', color: '#fff' };
    
    setFormData(prev => ({
      ...prev,
      category: categoryName,
      categoryBg: colors.bg,
      categoryColor: colors.color
    }));
  };

  const addVariant = () => {
    if (variantInput.trim() && !formData.variants.includes(variantInput.trim())) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, variantInput.trim()]
      }));
      setVariantInput('');
    }
  };

  const removeVariant = (variant) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v !== variant)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Preparar datos para enviar
      const productData = {
        ...formData,
        price: Number(formData.price),
        discount: formData.discount ? Number(formData.discount) : null,
        amount: Number(formData.amount)
      };

      const url = isEditing 
        ? `${API_URL}/api/productos/${id}`
        : `${API_URL}/api/productos`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el producto');
      }

      navigate('/administracion/productos');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}>
        <div className="admin-loading">
          <div className="admin-spinner-large"></div>
          <p>Cargando producto...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}>
      <div className="admin-product-form-container">
        {/* Breadcrumb */}
        <nav className="admin-breadcrumb">
          <Link to="/administracion/productos">Productos</Link>
          <span>/</span>
          <span>{isEditing ? 'Editar' : 'Nuevo'}</span>
        </nav>

        {error && (
          <div className="admin-form-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-product-form">
          <div className="admin-form-grid">
            {/* Left Column - Basic Info */}
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Información básica</h3>
              
              <div className="admin-form-group">
                <label htmlFor="name">Nombre del producto *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Glass Pipe Premium"
                />
              </div>

              <div className="admin-form-group">
                <label>Categoría personalizable *</label>
                
                {/* Category Suggestions */}
                <div className="admin-badge-suggestions">
                  <span className="admin-badge-suggestions-label">Sugerencias:</span>
                  <div className="admin-badge-suggestions-list">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => applyCategorySuggestion(cat)}
                        className={`admin-badge-suggestion ${formData.category === cat ? 'active' : ''}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Category Text Input */}
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="Nombre de la categoría"
                  className="admin-badge-input"
                />
                
                {/* Category Color Pickers */}
                <div className="admin-badge-colors">
                  <div className="admin-color-picker">
                    <label htmlFor="categoryBg">Fondo:</label>
                    <div className="admin-color-input-wrapper">
                      <input
                        type="color"
                        id="categoryBg"
                        value={formData.categoryBg}
                        onChange={(e) => handleCategoryColorChange('categoryBg', e.target.value)}
                      />
                      <span className="admin-color-value">{formData.categoryBg}</span>
                    </div>
                  </div>
                  <div className="admin-color-picker">
                    <label htmlFor="categoryColor">Texto:</label>
                    <div className="admin-color-input-wrapper">
                      <input
                        type="color"
                        id="categoryColor"
                        value={formData.categoryColor}
                        onChange={(e) => handleCategoryColorChange('categoryColor', e.target.value)}
                      />
                      <span className="admin-color-value">{formData.categoryColor}</span>
                    </div>
                  </div>
                </div>
                
                {/* Category Preview */}
                {formData.category && (
                  <div className="admin-badge-preview">
                    <span className="admin-badge-preview-label">Vista previa:</span>
                    <span 
                      className="admin-badge"
                      style={{
                        backgroundColor: formData.categoryBg,
                        color: formData.categoryColor
                      }}
                    >
                      {formData.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label htmlFor="description">Descripción *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe las características del producto..."
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="price">Precio (CRC) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="10000"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="amount">Stock *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="10"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="discount">Descuento (%)</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    max="99"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Images & Badge */}
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Imágenes y Badge</h3>

              <div className="admin-form-group">
                <label>Imagen principal *</label>
                
                {/* Upload WebP */}
                <div className="admin-image-upload">
                  <input
                    type="file"
                    id="image-upload"
                    accept=".webp"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="admin-upload-label">
                    {uploadingImage ? (
                      <>
                        <span className="admin-spinner-small"></span>
                        Subiendo...
                      </>
                    ) : (
                      <>
                        📁 Subir imagen WebP
                      </>
                    )}
                  </label>
                  <span className="admin-upload-info">Formato requerido: WebP (máx 5MB)</span>
                </div>
                
                {uploadError && (
                  <div className="admin-upload-error">⚠️ {uploadError}</div>
                )}
                
                {/* URL Input */}
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  placeholder="/images/producto_gen.webp"
                  className="admin-image-url-input"
                />
                
                {formData.image && (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="admin-image-preview"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>

              <div className="admin-form-group">
                <label>Badge personalizable</label>
                
                {/* Suggestions */}
                <div className="admin-badge-suggestions">
                  <span className="admin-badge-suggestions-label">Sugerencias:</span>
                  <div className="admin-badge-suggestions-list">
                    {BADGE_SUGGESTIONS.map(suggestion => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => applyBadgeSuggestion(suggestion)}
                        className={`admin-badge-suggestion ${formData.badge === suggestion ? 'active' : ''}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Badge Text Input */}
                <input
                  type="text"
                  id="badge"
                  name="badge"
                  value={formData.badge}
                  onChange={handleBadgeTextChange}
                  placeholder="Texto del badge (ej: Nuevo, Oferta, etc.)"
                  className="admin-badge-input"
                />
                
                {/* Color Pickers */}
                <div className="admin-badge-colors">
                  <div className="admin-color-picker">
                    <label htmlFor="badgeBg">Fondo:</label>
                    <div className="admin-color-input-wrapper">
                      <input
                        type="color"
                        id="badgeBg"
                        value={formData.badgeBg}
                        onChange={(e) => handleBadgeColorChange('badgeBg', e.target.value)}
                      />
                      <span className="admin-color-value">{formData.badgeBg}</span>
                    </div>
                  </div>
                  <div className="admin-color-picker">
                    <label htmlFor="badgeColor">Texto:</label>
                    <div className="admin-color-input-wrapper">
                      <input
                        type="color"
                        id="badgeColor"
                        value={formData.badgeColor}
                        onChange={(e) => handleBadgeColorChange('badgeColor', e.target.value)}
                      />
                      <span className="admin-color-value">{formData.badgeColor}</span>
                    </div>
                  </div>
                </div>
                
                {/* Badge Preview */}
                {formData.badge && (
                  <div className="admin-badge-preview">
                    <span className="admin-badge-preview-label">Vista previa:</span>
                    <span 
                      className="admin-badge"
                      style={{
                        backgroundColor: formData.badgeBg,
                        color: formData.badgeColor
                      }}
                    >
                      {formData.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="admin-form-group">
                <label>Variantes disponibles</label>
                <div className="admin-variants-list">
                  {formData.variants.map((variant, index) => (
                    <span key={index} className="admin-variant-tag">
                      {variant}
                      <button
                        type="button"
                        onClick={() => removeVariant(variant)}
                        className="admin-variant-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="admin-variants-add">
                  <input
                    type="text"
                    value={variantInput}
                    onChange={(e) => setVariantInput(e.target.value)}
                    placeholder="Nueva variante"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariant())}
                  />
                  <button
                    type="button"
                    onClick={addVariant}
                    className="admin-btn admin-btn-secondary"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Card Preview */}
          <div className="admin-form-section admin-preview-section">
            <h3 className="admin-form-section-title">👁️ Vista previa del producto</h3>
            <div className="admin-product-preview-container">
              <div className="admin-product-card-preview">
                <div className="admin-preview-image-wrap">
                  <img 
                    src={formData.image || '/images/producto_gen.webp'} 
                    alt={formData.name || 'Producto'} 
                    className="admin-preview-image"
                    onError={(e) => e.target.src = '/images/producto_gen.webp'}
                  />
                  {formData.badge && (
                    <div 
                      className="admin-preview-badge"
                      style={{ background: formData.badgeBg, color: formData.badgeColor }}
                    >
                      {formData.badge}
                    </div>
                  )}
                </div>
                <div className="admin-preview-info">
                  <p 
                    className="admin-preview-category"
                    style={{ color: formData.categoryColor, background: formData.categoryBg }}
                  >
                    {formData.category || 'Categoría'}
                  </p>
                  <h3 className="admin-preview-name">{formData.name || 'Nombre del producto'}</h3>
                  <span className="admin-preview-price">
                    ₡{formData.price ? Math.round(Number(formData.price)).toLocaleString('es-CR') : '0'}
                  </span>
                </div>
                <div className="admin-preview-divider" />
                <button className="admin-preview-btn" type="button">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="admin-form-actions">
            <Link to="/administracion/productos" className="admin-btn admin-btn-secondary">
              Cancelar
            </Link>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="admin-spinner-small"></span>
                  Guardando...
                </>
              ) : (
                isEditing ? '💾 Guardar cambios' : '➕ Crear producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminProductForm;
