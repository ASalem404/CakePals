const geolib = require("geolib");

exports.sort = (products, targetLocation) => {
  const referenceCoordinates = {
    latitude: targetLocation[1],
    longitude: targetLocation[0],
  };

  // Calculate distances from the reference coordinates to each product's location
  const productsWithDistances = products.map((product) => {
    const distance = geolib.getDistance(referenceCoordinates, {
      latitude: product.creator.location.coordinates[1],
      longitude: product.creator.location.coordinates[0],
    });

    // Create a new object with the 'distance' field added
    let extractedProduct = { ...product._doc };
    extractedProduct.distance = distance;
    return extractedProduct;
  });

  // Sort the new array by the 'distance' field in ascending order
  productsWithDistances.sort((a, b) => a.distance - b.distance);

  return productsWithDistances;
};
