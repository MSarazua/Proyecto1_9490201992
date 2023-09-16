const Product = require("../Models/productModel");
const verifyToken = require("../authMiddleware");

exports.getCatalog = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al obtener los productos." });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.ID);
    if (!product) {
      return res.status(404).json({ Mensaje: "Producto no encontrado." });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al obtener el producto." });
  }
};

exports.createOrUpdateProduct = async (req, res) => {
  try {
    const {
      Identificador,
      Nombre,
      Marca,
      Disponibilidad,
      Descuento,
      Precio,
      Imagen,
      Descripcion,
      Categorias,
      Habilitado,
    } = req.body;

    if (
      !Nombre ||
      !Marca ||
      !Disponibilidad ||
      !Descuento ||
      !Precio ||
      !Imagen ||
      !Descripcion ||
      Categorias.length === 0 ||
      Habilitado === undefined
    ) {
      return res
        .status(400)
        .json({ Mensaje: "Todos los campos son obligatorios." });
    }

    const PrecioDescuento = Precio * ((100 - Descuento) / 100);

    let product = await Product.findById(req.params.ID);
    if (product) {
      product = await Product.findByIdAndUpdate(
        req.params.ID,
        {
          Identificador,
          Nombre,
          Marca,
          Disponibilidad,
          Descuento,
          PrecioDescuento,
          Imagen,
          Descripcion,
          Categorias,
          Habilitado,
        },
        { new: true }
      );
      return res.json({
        Mensaje: "Producto actualizado exitosamente.",
        product,
      });
    }

    product = new Product({
      Identificador,
      Nombre,
      Marca,
      Disponibilidad,
      Descuento,
      PrecioDescuento,
      Imagen,
      Descripcion,
      Categorias,
      Habilitado,
    });

    await product.save();
    res.json({ Mensaje: "Producto creado exitosamente.", product });
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al gestionar el producto." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.ID);
    if (!product) {
      return res.status(404).json({ Mensaje: "Producto no encontrado." });
    }
    product.Habilitado = !product.Habilitado;
    await product.save();

    if (product.Habilitado) {
      res.json({ Mensaje: "Producto reactivado exitosamente." });
    } else {
      res.json({ Mensaje: "Producto desactivado exitosamente." });
    }
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al gestionar el producto." });
  }
};
