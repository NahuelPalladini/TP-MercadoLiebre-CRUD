const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    // Do the magic
    return res.render("products", {
      products,
      toThousand,
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    // Do the magic
    const product = products.find((product) => product.id === +req.params.id);
    return res.render("detail", {
      ...product,
      toThousand,
    });
  },

  // Create - Form to create
  create: (req, res) => {
    // Do the magic
    return res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    // Do the magic

    const lastID = products[products.length - 1].id;
    const {name, price, discount, description, category} = req.body;
    const newProduct = {
      id: lastID + 1,
      name: name.trim(),
      price: +price,
      discount: +discount,
      category: category,
      description:description.trim(),
      image: "default-image.png",
    };

	products.push(newProduct);
	fs.writeFileSync(productsFilePath,JSON.stringify(products), 'utf-8')

    return res.redirect("/products/detail/"+ newProduct.id)
  },

  // Update - Form to edit
  edit: (req, res) => {
    // Do the magic
	const product = products.find((product) => product.id === +req.params.id);
	return res.render('product-edit-form',{
		...product,
	})
  },
  // Update - Method to update
  update: (req, res) => {
    // Do the magic
	const {name, price, discount, description, category} = req.body;

	const productUpdate = products.map(product => {
		if (product.id === +req.params.id){

			product.name = name.trim()
			product.price = +price
			product.discount = +discount,
			product.description = description.trim()
			
			
		}

		return product
	})


	fs.writeFileSync(productsFilePath,JSON.stringify(productUpdate), 'utf-8')

    return res.redirect("/products/detail/"+ req.params.id)
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    // Do the magic
	/* const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8")); */
	/* console.log(products.length); */
	const noProduct = products.filter((product) => product.id !== +req.params.id);
	/* console.log(noProduct.length); */
	fs.writeFileSync(productsFilePath,JSON.stringify(noProduct), 'utf-8')

	return res.redirect('/')
  },
};

module.exports = controller;
