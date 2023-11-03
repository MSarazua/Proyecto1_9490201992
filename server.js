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

mongoose.connect('mongodb+srv://msarazuac:YK71sJ1RVVZ15utk@cluster0.hffdnqw.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa');
    })
    .catch(error => {
        console.error('Error de conexión: ', error);
    });

app.get('/', (req, res) => {
    res.json({ message: 'Sistema iniciado' });
});

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sistema funcionando en el puerto: ${PORT}`);
});
