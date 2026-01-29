import { useContext, useEffect, useState } from "react";
import './AddProducts.css'
import { AuthContext } from "../../AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function AddProducts() {

  const  {addProducts, getProductById, saveProduct} = useContext(AuthContext);
  const {id} = useParams();

  const [error, setError] = useState('');
  const [edit, setEdit] = useState(false)

  const navigate = useNavigate()

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    offer_price: '',
    color: '',
    brand: '',
    category: '',
    image: []
  });

  useEffect(() => {
    async function check(){
      if(id){
        let product = await getProductById(id);
        setEdit(true)
        setProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          offer_price: product.offer_price,
          color: product.color,
          brand: product.brand,
          category: product.category,
          image: [
            product.image[0],
            product.image[1],
            product.image[2],
            product.image[3]
          ]
        })
      }
    }
    check()
    return () => {
      setEdit(false)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loading)return;
    if(edit){
      await saveProduct(id, product)
      setEdit(false);
      setProduct({
      name: '',
      description: '',
      price: '',
      offer_price: '',
      color: '',
      brand: '',
      category: '',
      image: []
    })
    navigate('/admin/add-products')
      return;
    }
    let res = await addProducts(product)
    if(!res.success){
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setError(res.message)
      return;
    }
    setProduct({
      name: '',
      description: '',
      price: '',
      offer_price: '',
      color: '',
      brand: '',
      category: '',
      image: []
    })
  }

  const handleChange = (e) => {
    setError('')
    if(e.target.name === 'price' || e.target.name === 'offer_price'){
      setProduct({
      ...product,
      [e.target.name]: Number(e.target.value)
    })
    }else{
      setProduct({
      ...product,
      [e.target.name]: e.target.value
    })
    }
  }

  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    let images = []

    if (files.length > 4) {
      alert("You can upload only 4 images");
      return;
    }

    setLoading(true);
    for(let file of files){
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "react_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlz7kvgzh/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      images.push(data.secure_url);
    }
    setLoading(false);
    if(product.image.length <= 4 - images.length){
      setProduct(prev => {
      return {
        ...prev,
        ['image']: [...prev.image, ...images]
      }
    })
    }
    
  };

  const imageDelete = (url) => {
    setProduct(prev => {
      return {
        ...prev,
        ['image']: product.image.filter(u => u !== url)
      }
    })
  }

  return (
    <>
      <form className="add-products" onSubmit={handleSubmit}>
        <h1 style={{color: 'red'}}>Add Products</h1>
        {
          error && <p style={{color: 'red'}}>{error}</p>
        }
        <label>
          Product Name :
          <input type="text" name="name" onChange={handleChange} value={product.name} />
        </label>
        <label>
          Description :
          <textarea name="description" className="desc" onChange={handleChange}  value={product.description}/>
        </label>
        <div className="flex-inputs">
          <label>
            Price :
            <input type="number" name="price" onChange={handleChange}  value={product.price} />
          </label>
          <label>
            Offer Price :
            <input type="number" name="offer_price" onChange={handleChange}  value={product.offer_price} />
          </label>
        </div>
        <div className="flex-3-inputs">
          <label>
            Color :
            <input type="text" name="color" onChange={handleChange}  value={product.color} />
          </label>
          <label>
            Brand :
            <input type="text" name="brand" onChange={handleChange}  value={product.brand} />
          </label>
          <label>
            Category :
            <select name="category" onChange={handleChange}  value={product.category}>
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
            <p>Drop Image</p>
            <button type="button" className="upload-btn">
              Upload Images
            </button>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
            />
          </div>
          <div className="view-images">
            {product.image.length ? product.image.map((image, index) => (
              <div className="view-image" key={index}>
                <div className="image-delete" onClick={() => imageDelete(image)}>
                  ⛌
                </div>
                <img src={image} alt="" />
              </div>
            )): ''
            }
          </div>
        </div>
        <button className={loading && 'btn-hidden'}>{edit ? 'Save Changes' : 'Add'}</button>
      </form>
    </>
  );
}

export default AddProducts;
