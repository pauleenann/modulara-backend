import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    // destructure product fields
    const {
      name,
      description,
      category,
      price,
      totalQuantity,
      variants,
      features,
      measurements
    } = req.body;

    // parse JSON fields safely
    const parsedVariants = JSON.parse(variants || '[]');
    const parsedFeatures = JSON.parse(features || '[]');
    const parsedMeasurements = JSON.parse(measurements || '{}');

    const imageUrls = req.files?.map(file => file.path) || [];

    // create product
    await Product.create({
      name,
      description,
      category,
      price,
      totalQuantity,
      attributes: {
        variants: parsedVariants,
        features: parsedFeatures,
        measurements: parsedMeasurements
      },
      images: imageUrls
    });

    return res.status(201).json({ message: 'Product added' });

  } catch (error) {
    console.error('Add Product Error:', error);
    return res.status(500).json({ error: error });
  }
};

export const editProduct = async (req, res) => {
  try {
    console.log('editing product')
    
    const id = req.params.id;
    
    if(!id){
      return res.status(500).json({
        message: 'Missing Id'
      })
    }
    
    // destructure product fields
    const {
      name,
      description,
      category,
      price,
      totalQuantity,
      variants,
      features,
      measurements,
      existing
    } = req.body;

    console.log("body: ", req.body)

    // parse JSON fields safely
    const parsedVariants = JSON.parse(variants || '[]');
    const parsedFeatures = JSON.parse(features || '[]');
    const parsedMeasurements = JSON.parse(measurements || '{}');

    const imageUrls = req.files?.map(file => file.path) || [];

    console.log('req files: ',req.files)
    console.log('imageUrls: ',imageUrls)
    // combine existing and imageUrls
    if(Array.isArray(existing)){
      existing.forEach(img => {
        imageUrls.push(img)
      });
    }else if(typeof existing == 'string'){
      imageUrls.push(existing)
    }

    console.log(imageUrls)

    // update
    await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          category,
          description,
          price,
          totalQuantity,
          "attributes.variants": parsedVariants,
          "attributes.features": parsedFeatures,
          "attributes.measurements": parsedMeasurements,
          images: imageUrls
        }
      }
    );
    

    return res.status(201).json({ message: 'Product edited' });

  } catch (error) {
    console.log('Edit Product Error:', error);
    return res.status(500).json({ error: error });
  }
};

export const removeProduct = async (req, res) =>{
  try {
    console.log('removing product')
    
    const id = req.params.id;
    
    if(!id){
      return res.status(500).json({
        message: 'Missing Id'
      })
    }

    // delete product
    await Product.findByIdAndDelete(id);

    return res.status(201).json({ message: 'Product removed' });

  } catch (error) {
    console.log('Remove Product Error:', error);
    return res.status(500).json({ error: error });
  }
}

export const getProducts = async (req, res)=>{
  try {
    const products = await Product.find(
      {},
      {
        _id: 1, 
        name: 1, 
        category: 1, 
        price: 1, 
        totalQuantity: 1,
        images: 1,
        attributes: 1
      }
    )

    if(products.length==0){
      return res.status(500).json({
        message: 'Something wrong. No products.'
      })
    }

    return res.status(200).json({
      products
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      return: 'Cannot retrieve products'
    })
  }
}

export const getProduct = async (req, res)=>{
  try {
    const id = req.params.id;
    
    if(!id){
      return res.status(500).json({
        message: 'Missing Id'
      })
    }

    const product = await Product.findById(id);

    if(product.length==0){
      return res.status(500).json({
        message: 'Something wrong. No product.'
      })
    }

    console.log(product)
    return res.status(200).json({
      product
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      return: 'Cannot retrieve products'
    })
  }
}