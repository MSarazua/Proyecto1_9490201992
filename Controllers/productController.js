const Product = require("../Models/productModel");
const verifyToken = require("../authMiddleware");

exports.getCatalog = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ Mensaje: "No se pudo obtener el producto.", error });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.ID);
    if (!product) {
      return res.status(404).json({ Mensaje: "No se encontró el producto." });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ Mensaje: "No se pudo obtener el producto.", error });
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
        .json({ Mensaje: "Ingrese los campos requeridos." });
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
        Mensaje: "Se actualizó el producto.",
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
    res.json({ Mensaje: "Registro correcto.", product });
  } catch (error) {
    res.status(500).json({ Mensaje: "No se agregó el producto." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.ID);
    if (!product) {
      return res.status(404).json({ Mensaje: "No se encontró el producto." });
    }
    product.Habilitado = !product.Habilitado;
    await product.save();

    if (product.Habilitado) {
      res.json({ Mensaje: "Producto activo." });
    } else {
      res.json({ Mensaje: "Producto inactivo." });
    }
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al actualizar el estado del producto." });
  }
};
