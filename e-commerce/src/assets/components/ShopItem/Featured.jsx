import CategoryPage from "../CategoryPage/CategoryPage";

const FeaturedProducts = () => (
  <CategoryPage title="Featured Products" filter={(p) => p.featured} />
);

export default FeaturedProducts;
