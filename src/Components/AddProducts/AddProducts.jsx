import { useContext, useEffect, useState } from "react";
import "./AddProducts.css";
import { AuthContext } from "../../AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function AddProducts() {

  const { addProducts, getProductById, saveProduct } = useContext(AuthContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    offer_price: "",
    color: "",
    brand: "",
    category: "",
    image: [],
  });

  useEffect(() => {
    async function check() {

      if (id) {

        const res = await getProductById(id);

        if (!res) return;

        setEdit(true);

        setProduct({
          name: res.name,
          description: res.description,
          price: res.price,
          offer_price: res.offer_price,
          color: res.color,
          brand: res.brand,
          category: res.category,
          image: [],
        });

      }

    }

    check();

    return () => {
      setEdit(false);
    };

  }, [id]);



  const handleChange = (e) => {

    setError("");

    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "offer_price" ? Number(value) : value,
    }));

  };



  const handleUpload = (e) => {

    const files = Array.from(e.target.files);

    if (files.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    setProduct((prev) => ({
      ...prev,
      image: files,
    }));

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("offer_price", product.offer_price);
    formData.append("brand", product.brand);
    formData.append("color", product.color);
    formData.append("category", product.category);

    product.image.forEach((img) => {
      formData.append("image", img);
    });

    let res;

    if (edit) {
      res = await saveProduct(id, formData);
    } else {
      res = await addProducts(formData);
    }

    setLoading(false);

    if (!res.success) {

      setError(res.message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setProduct({
      name: "",
      description: "",
      price: "",
      offer_price: "",
      color: "",
      brand: "",
      category: "",
      image: [],
    });
    

    setError("")
    navigate("/admin/add-products");

  };



  const imageDelete = (index) => {

    const updated = [...product.image];

    updated.splice(index, 1);

    setProduct((prev) => ({
      ...prev,
      image: updated,
    }));

  };



  return (
    <form className="add-products" onSubmit={handleSubmit}>

      <h1 style={{ color: "red" }}>
        {edit ? "Edit Product" : "Add Products"}
      </h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Product Name :
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
      </label>

      <label>
        Description :
        <textarea
          className="desc"
          name="description"
          value={product.description}
          onChange={handleChange}
        />
      </label>

      <div className="flex-inputs">

        <label>
          Price :
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </label>

        <label>
          Offer Price :
          <input
            type="number"
            name="offer_price"
            value={product.offer_price}
            onChange={handleChange}
          />
        </label>

      </div>



      <div className="flex-3-inputs">

        <label>
          Color :
          <input
            type="text"
            name="color"
            value={product.color}
            onChange={handleChange}
          />
        </label>

        <label>
          Brand :
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
          />
        </label>

        <label>
          Category :
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="Smart Home">Smart Home</option>
            <option value="Gaming">Gaming</option>
            <option value="Laptop Accessories">Laptop Accessories</option>
            <option value="Television">Television</option>
            <option value="Power Banks">Power Banks</option>
            <option value="Chargers">Chargers</option>
            <option value="Wearables">Wearables</option>
            <option value="Computer Accessories">Computer Accessories</option>
            <option value="Audio">Audio</option>
            <option value="Networking">Networking</option>
            <option value="Storage">Storage</option>
            <option value="Cameras">Cameras</option>
            <option value="Tablets">Tablets</option>
          </select>
        </label>

      </div>



      <div className="add-images">

        <div className="upload-box">

          <p>Upload Images</p>

          <button type="button" className="upload-btn">
            Select Images
          </button>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
          />

        </div>



        <div className="view-images">

          {product.image.map((img, index) => (

            <div className="view-image" key={index}>

              <div
                className="image-delete"
                onClick={() => imageDelete(index)}
              >
                ⛌
              </div>

              <img src={URL.createObjectURL(img)} alt="" />

            </div>

          ))}

        </div>

      </div>



      <button className={loading ? "btn-hidden" : ""}>
        {edit ? "Save Changes" : "Add"}
      </button>

    </form>
  );
}

export default AddProducts;