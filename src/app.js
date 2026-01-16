const index = require('./Index')

index.listen(process.env.PORT_BACK, '0.0.0.0', () => {
  console.log(`Backend corriendo en el puerto ${process.env.PORT_BACK}`);
});