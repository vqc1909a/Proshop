//Si solo fuera peru, los campos serían departamento, provincia, distrito y cod postal, si no tiene codigo postal es muy dificl de ahcer llegar el producto ahi
const geographicRegions = [
    {
      country: "Peru",
      city: "Pasco",
      postalCode: "19001",
      shippingPrice: 100
    },
    {
      country: "Peru",
      city: "Lima",
      postalCode: "02002",
      shippingPrice: 50
    },
    {
        country: "Peru",
        city: "Arequipa",
        postalCode: "04001",
        shippingPrice: 200,
    },
    {
        country: "Aleatorio",
        city: "Aleatorio",
        postalCode: "00000",
        shippingPrice: 0,
    },

] 

export default geographicRegions;