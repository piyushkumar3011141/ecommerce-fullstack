import { publicApi } from "./axiosConfig";

// Footer links (database se)
export const getFooter = () => publicApi.get("/api/site/footer");

// About, Privacy, FAQ jaise pages
export const getSitePage = (slug) => publicApi.get(`/api/site/pages/${slug}`);

export const sendContactMessage = (data) =>
  publicApi.post("/api/site/contact", data);

export const subscribeNewsletter = (email) =>
  publicApi.post("/api/site/newsletter", { email });
