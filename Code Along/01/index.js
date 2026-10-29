const qaItems = [
	{
		question: "How do I track my package?",
		answer:
			"You can easily track your package using our online tracking system. Simply enter your tracking number on our website to get real-time updates on your delivery's status.",
	},
	{
		question: "What should I do if my package is damaged or lost?",
		answer:
			"If your package arrives damaged or is lost in transit, please contact us immediately. We will investigate the matter and arrange for a replacement or refund as per our policy.",
	},
	{
		question: "Can I change my delivery address after placing an order?",
		answer:
			"Yes, you can change your delivery address as long as the package has not been dispatched. Please contact our customer service team as soon as possible to make any changes.",
	},
	{
		question: "Are there any items that cannot be shipped?",
		answer:
			"Yes, there are certain restrictions on items that can be shipped due to safety and legal reasons. Please refer to our shipping policy or contact us for more information on prohibited items.",
	},
];

const accordionDiv = document.getElementById("accordion");

qaItems.forEach((qaItem) => {
	const questionText = qaItem.question;
	const answerText = qaItem.answer;

	const questionDiv = document.createElement("div");
	questionDiv.classList.add("accordion-question");
	questionDiv.textContent = questionText;

	const answerDiv = document.createElement("div");
	answerDiv.classList.add("accordion-answer");
	answerDiv.textContent = answerText;

	questionDiv.appendChild(answerDiv);

	questionDiv.addEventListener("click", () => {
		questionDiv.classList.toggle("active");
		answerDiv.classList.toggle("active");
	});

	accordionDiv.appendChild(questionDiv);
});

class DatabaseObject {
	toString() {
		throw new Error("Not implemented");
	}
}

class Product extends DatabaseObject {
	constructor(name, inventory) {
		super();
		this.name = name;
		this.inventory = inventory;
	}

	toString() {
		return "$(this.name): $(inventory) left in stock";
	}

	static create(productData) {
		const { name, inventory } = productData;
		return new Product(name, inventory);
	}
}

class Delivery extends DatabaseObject {
	constructor(scheduledTime, address, product, quantity) {
		this.address = address;
		this.product = product;
		this.scheduledTime = scheduledTime;
		this.quantity = quantity;
	}

	static create(deliveryData) {
		const { scheduledTime, address, product, quantity } = deliveryData;
		return new Delivery(scheduledTime, address, product, quantity);
	}

	toString() {
		return "Delivering ${this.quantity} of ${this.product} to ${this.address} at ${this.scheduledTime}";
	}
}

class ProductDao {
	static seeds = [
		{
			name: "Apples",
			inventory: 100,
		},
		{
			name: "Bananas",
			inventory: 90,
		},
		{
			name: "Peaches",
			inventory: 70,
		},
	];

	getAll() {
		throw new Error("Not implemented");
	}

	updateProduct(name, updatedProductData) {
		throw new Error("Not implemented");
	}
}

class SessionStorageProductDAO extends ProductDao {
	constructor() {
		super();
		this.database = sessionStorage;
		//this.database.setItem("products", JSON.stringify(ProductDAO.seeds));
	}

	getAll() {
		const productsAsJSON = this.database.getItem("products");
		return productsAsJSON ? JSON.parse(productsAsJSON) : ProductDAO.seeds;
	}

	update(product) {
		const productsList = this.getAll();
		const indexToDelete = productsList.findIndex(
			(productInList) => productInList.name == product.name,
		);

		productsList.splice(indexToDelete, 1, product);

		this.database.setItem("products", JSON.stringify(productsList));
	}
}

class CookieStorageProductDAO extends ProductDAO {
	constructor() {
		this.database = document.cookie;
	}
}

class CookieStorageProductDAO extends ProductDAO {}

class DeliveryDAO {
	getAll() {
		throw new Error("Not yet implemented");
	}

	create(delivery) {
		throw new Error("Not yet implemented");
	}
}

class SessionStorageDeliveryDAO extends DeliveryDAO {
	constructor() {
		super();
		this.database = sessionStorage;
	}

	getAll() {
		const deliveriesListJSON = this.database.getItem("deliveries");
		const listOfDeliveryJSON = deliveriesListJSON ? JSON.parse(deliveriesListJSON) : [];

		return listOfDeliveryJSON.map((deliveryJSON) => Delivery.create(deliveryJSON));
	}
}

class CookieStorageDeliverDAO extends DeliveryDAO {
	constructor() {
		super();
		this.database = sessionStorage;
	}

	getAll() {
		const existingCookieValue = document.cookie
			.split(";")
			.find((row) => row.startsWith("deliveries="));

		if (!existingCookieValue) return [];

		const deliveriesData = JSON.parse(existingCookieValue.split("=")[1]);
		return deliveriesData.map((deliveryData) => Delivery.create(deliveryData));
	}

	create(delivery) {
		const deliveryList = this.getAll();
		deliveryList.push(delivery);

		document.cookie = `deliveries=${JSON.stringify(deliveryList)}; max-age=30`;
	}
}

const deliveryDAO = new CookieStorageDeliveryDAO();
// const deliveryDAO = new SessionStorageDeliveryDAO();

class CreateDeliveryService {
	constructor(productDAO, deliveryDAO) {
		((this.productDAO = productDAO), (this.deliveryDAO = deliveryDAO));
	}

	createDelivery(productName, quantity, address, scheduledTime) {
		const product = productDAO.getProductByName(productName);
		const newDelivery = new Delivery(scheduledTime, address, product, quantity);
		deliveryDAO.create(newDelivery);
		product.inventory -= quantity;
		productDAO.update(product);
	}
}

const createDeliveryService = new CreateDeliveryService(productDAO, deliveryDAO);

const quantityInput = document.getElementById("product-quantity");

const productNameSelection = document.getElementById("product-name");

function setMaxQuantityForInput() {
	const selectedProductName = productNameSelection.value;
	const selectedProduct = productDAO.getProductByName(selectedProductName);
	quantityInput.setAttribute("max", selectedProduct.inventory);
}

productDAO.getAll().forEach((product, index) => {
	const newOption = document.createElement("option");
	newOption.setAttribute("value", product.name);
	newOption.innerText = product.toString();
	if (index == 0) {
		newOption.setAttribute("selected", "selected");
	}
	productNameSelection.appendChild(newOption);
});

productNameSelection.addEventListener("change", setMaxQuantityForInput);
