import CategoryPage from "../CategoryPage/CategoryPage";

const NewArrivals = () => (
  <CategoryPage title="New Arrivals" filter={(p) => p.newArrival} />
);

export default NewArrivals;
