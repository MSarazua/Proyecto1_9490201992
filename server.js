const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes');
const productRoutes = require('./Routes/productRoutes');
const cartRoutes = require('./Routes/cartRouter');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  

mongoose.connect('mongodb://localhost:27017/Desarrollo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a la base de datos MongoDB');
    })
    .catch(error => {
        console.error('Error al conectarse a la base de datos: ', error);
    });

app.get('/', (req, res) => {
    res.json({ message: 'API de E-commerce funcionando!' });
});

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
