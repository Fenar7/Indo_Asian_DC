import "./style.scss";
import { ProductDetailScreen } from "@/components/product-detail/ProductDetailScreen";

const ProductDetailPage = () => {
  return (
    <div className="product-detail-page-container-main flex items-center justify-center">
      <div className="product-detail-page-container container">
        <ProductDetailScreen />
      </div>
    </div>
  );
};

export default ProductDetailPage;
