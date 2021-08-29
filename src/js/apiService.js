import axios from "axios";

const MY_API_KEY = "23131793-6d85f6b0cc60a2b86f77a0160";
axios.defaults.baseURL =
  "https://pixabay.com/api/?image_type=photo&orientation=horizontal";

export async function getPictures(query, page) {
  const {
    data: { hits },
  } = await axios.get(`&q=${query}&page=${page}&per_page=12&key=${MY_API_KEY}`);

  return hits;
}