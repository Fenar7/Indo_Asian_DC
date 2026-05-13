import "./home.scss";
import {
  ShopPageScreen,
  HeroSlide,
  SanityCategory,
  SanityProduct,
} from "@/components/shop-page/ShopPageScreen";
import { client } from "@/sanity/lib/client";
import { unstable_noStore } from "next/cache";

export const revalidate = 0;

export default async function Home() {
  unstable_noStore(); // ensure fresh Sanity data on every request

  // Hero Slider query
  const heroQuery = `*[_type == "heroSlider"][0].images[]{
    "id": _key,
    "image": asset->url,
    alt
  }`;

  // Categories query — sorted by order field ascending
  const categoriesQuery = `*[_type == "category"] | order(order asc) {
    _id,
    name,
    order
  }`;

  // Products query — with resolved category reference and image URL
  const productsQuery = `*[_type == "product"] | order(_createdAt asc) {
    _id,
    name,
    "slug": slug.current,
    code,
    unit,
    weight,
    price,
    badge,
    "image": image.asset->url,
    "categoryId": category._ref
  }`;

  let fetchedSlides: HeroSlide[] | undefined;
  let fetchedCategories: SanityCategory[] = [];
  let fetchedProducts: SanityProduct[] = [];

  try {
    const [heroData, categoriesData, productsData] = await Promise.all([
      client.fetch(heroQuery),
      client.fetch(categoriesQuery),
      client.fetch(productsQuery),
    ]);

    if (heroData && Array.isArray(heroData) && heroData.length > 0) {
      fetchedSlides = heroData;
    }
    if (categoriesData && Array.isArray(categoriesData)) {
      fetchedCategories = categoriesData;
    }
    if (productsData && Array.isArray(productsData)) {
      fetchedProducts = productsData;
      console.log("[Server] products:", fetchedProducts.length, "sample categoryId:", fetchedProducts[0]?.categoryId);
    }
  } catch (error) {
    console.error("Failed to fetch data from Sanity:", error);
  }

  return (
    <div className="shop-page-container-main flex items-center justify-center">
      <div className="shop-page-container container">
        <ShopPageScreen
          heroSlides={fetchedSlides}
          categories={fetchedCategories}
          products={fetchedProducts}
        />
      </div>
    </div>
  );
}
