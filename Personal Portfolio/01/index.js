/* Project list content and creation */

const projectItems = [
	{
		title: "Project 1",
		URL: "#",
		Description:
			"Description of what project 1 does and what I learned doing it. Description of what project 1 does and what I learned doing it.",
	},
	{
		title: "Project 2",
		URL: "#",
		Description:
			"Description of what project 2 does and what I learned doing it. Description of what project 2 does and what I learned doing it.",
	},
	{
		title: "Project 3",
		URL: "#",
		Description:
			"Description of what project 3 does and what I learned doing it. Description of what project 3 does and what I learned doing it. ",
	},
	{
		title: "Project 4",
		URL: "#",
		Description:
			"Description of what project 4 does and what I learned doing it. Description of what project 4 does and what I learned doing it.",
	},
];

const projectsDiv = document.getElementById("projects");
const projectList = document.createElement("ul");

projectItems.forEach((projectItem) => {
	const projectTitle = projectItem.title;
	const projectURL = projectItem.URL;
	const projectDesc = projectItem.Description;

	const projectListedItem = document.createElement("li");
	projectListedItem.classList.add("project");

	const projectLiLink = document.createElement("a");
	projectLiLink.href = projectURL;
	projectLiLink.textContent = projectTitle;
	projectLiLink.target = "_blank";

	const projectLiPara = document.createElement("p");
	projectLiPara.textContent = projectDesc;

	projectListedItem.appendChild(projectLiLink);
	projectListedItem.appendChild(projectLiPara);

	projectListedItem.addEventListener("click", () => {
		projectListedItem.classList.toggle("active");
		//projectLiPara.classList.toggle("active");
		//projectLiLink.classList.toggle("active");
	});

	projectList.appendChild(projectListedItem);
});

projectsDiv.appendChild(projectList);

class DatabaseObject {
	toString() {
		throw new Error("Not Implemented");
	}
}

class Reference extends DatabaseObject {
	constructor(id, name, email, company = "") {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.company = company;
	}

	toString() {
		let companyText = this.company ? ` (${this.company})` : "";
		return `${this.name}${companyText} - ${this.email}`;
	}

	static create(refData) {
		const { id, name, email, company } = refData;
		return new Reference(id, name, email, company);
	}
}

class Testimonial extends DatabaseObject {
	constructor(comment, rating, referenceId) {
		super();
		this.comment = comment;
		this.rating = rating;
		this.referenceId = referenceId;
	}

	toString(referenceName = "Anonymous") {
		return `"${this.comment}" - ${referenceName} (${this.rating}/5 stars)`;
	}

	static create(testimonialData) {
		const { comment, rating, referenceId } = testimonialData;
		return new Testimonial(comment, rating, referenceId);
	}
}

class TestimonialDAO {
	static seedData = {
		references: [
			{
				id: "ref-1",
				name: window.faker.name.findName(),
				email: window.faker.internet.email(),
				company: window.faker.company.companyName(),
			},
			{
				id: "ref-2",
				name: window.faker.name.findName(),
				email: window.faker.internet.email(),
				company: window.faker.company.companyName(),
			},
			{
				id: "ref-3",
				name: window.faker.name.findName(),
				email: window.faker.internet.email(),
				company: window.faker.company.companyName(),
			},
		],
		testimonials: [
			{
				comment: "Absolute pleasure working together on development projects!",
				rating: 5,
				referenceId: "ref-1",
			},
			{
				comment: "Incredible attention to detail and appealing UI.",
				rating: 5,
				referenceId: "ref-2",
			},
			{
				comment: "Reliable and delivers high-quality work on time",
				rating: 5,
				referenceId: "ref-3",
			},
		],
	};

	getAll() {
		throw new Error("Not Implemented");
	}
	create(testimonial, reference) {
		throw new Error("Not Implemented");
	}
}

class SessionStorageTestimonialDAO extends TestimonialDAO {
	constructor() {
		super();
		this.database = sessionStorage;
		if (!this.database.getItem("portfolio_data")) {
			this.database.setItem("portfolio_data", JSON.stringify(TestimonialDAO.seedData));
		}
	}

	getAll() {
		const dataJSON = this.database.getItem("portfolio_data");
		const data = dataJSON ? JSON.parse(dataJSON) : TestimonialDAO.seedData;

		return {
			references: data.references.map((r) => Reference.create(r)),
			testimonials: data.testimonials.map((t) => Testimonial.create(t)),
		};
	}

	create(testimonial, reference) {
		const dataJSON = this.database.getItem("portfolio_data");
		const data = dataJSON ? JSON.parse(dataJSON) : TestimonialDAO.seedData;

		let existingRef = data.references.find((r) => r.email === reference.email);
		let refId = existingRef ? existingRef.id : "ref-" + Date.now();

		if (!existingRef) {
			reference.id = refId;
			data.references.push({
				id: reference.id,
				name: reference.name,
				email: reference.email,
				company: reference.company,
			});
		}

		testimonial.referenceId = refId;
		data.testimonials.push({
			comment: testimonial.comment,
			rating: testimonial.rating,
			referenceId: testimonial.referenceId,
		});

		this.database.setItem("portfolio_data", JSON.stringify(data));
	}
}

class CookieStorageTestimonialDAO extends TestimonialDAO {
	constructor() {
		super();
		if (!this.getCookieData()) {
			this.setCookieData(TestimonialDAO.seedData);
		}
	}

	getCookieData() {
		const existingCookie = document.cookie
			.split(";")
			.find((row) => row.startsWith("portfolio_data="));

		if (!existingCookie) return null;
		return JSON.parse(existingCookie.split("=")[1]);
	}

	setCookieData(dataObj) {
		const jsonStr = JSON.stringify(dataObj);
		document.cookie = `portfolio_data=${jsonStr}; max-age=60; path=/`;
	}

	getAll() {
		const data = this.getCookieData() || TestimonialDAO.seedData;
		return {
			references: data.references.map((r) => Reference.create(r)),
			testimonials: data.testimonials.map((t) => Testimonial.create(t)),
		};
	}

	create(testimonial, reference) {
		const data = this.getCookieData() || TestimonialDAO.seedData;

		let existingRef = data.references.find((r) => r.email === reference.email);
		let refId = existingRef
			? existingRef.id
			: "ref-" + Math.random().toString(36).substring(2, 8);
		//random six digit base 36 id generated

		if (!existingRef) {
			reference.id = refId;
			data.references.push({
				id: reference.id,
				name: reference.name,
				email: reference.email,
				company: reference.company,
			});
		}

		testimonial.referenceId = refId;
		data.testimonials.push({
			comment: testimonial.comment,
			rating: testimonial.rating,
			referenceId: testimonial.referenceId,
		});

		this.setCookieData(data);
	}
}

// Select active DAO. Change to = CookieStorageTestimonialDAO to select cookies
// const testimonialDAO = new CookieStorageTestimonialDAO();
const testimonialDAO = new SessionStorageTestimonialDAO();

//------------------------------------
//Service section//
class CreateTestimonialService {
	constructor(dao) {
		this.dao = dao;
	}

	createTestimonial(comment, rating, name, email, company) {
		const newTestimonial = new Testimonial(comment, rating, null);
		const newReference = new Reference(null, name, email, company);
		this.dao.create(newTestimonial, newReference);
	}
}

const createTestimonialService = new CreateTestimonialService(testimonialDAO);

//----------------------------------
//Dom manipulation, testimonial input form and event section

const referencesListEl = document.getElementById("references-list");
const avgRatingHeading = document.getElementById("average-rating-heading");

const databaseData = testimonialDAO.getAll();
const references = databaseData.references;
const testimonials = databaseData.testimonials;

references.forEach((ref) => {
	const refListItem = document.createElement("li");
	refListItem.className = "reference-item";

	let companyText = ref.company ? ` (${ref.company})` : "";
	refListItem.innerHTML = `<strong>${ref.name}</strong>${companyText} - <em>${ref.email}</em>`;

	const nestedUl = document.createElement("ul");

	const refTestimonials = testimonials.filter((t) => t.referenceId === ref.id);

	refTestimonials.forEach((t) => {
		const tListItem = document.createElement("li");
		tListItem.innerText = t.toString(ref.name);
		nestedUl.appendChild(tListItem);
	});

	refListItem.appendChild(nestedUl);
	referencesListEl.appendChild(refListItem);
});

//Average rating
if (testimonials.length > 0) {
	const totalRatingSum = testimonials.reduce((sum, t) => sum + Number(t.rating), 0);
	const averageRating = totalRatingSum / testimonials.length;
	avgRatingHeading.innerText = `Average Rating: ${averageRating.toFixed(1)}`;
} else {
	avgRatingHeading.innerText = `Average Rating: 0.0`;
}

//Form submission
const testimonialForm = document.getElementById("testimonial-form");

testimonialForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const submittedFormData = new FormData(testimonialForm);
	const formData = Object.fromEntries(submittedFormData.entries());

	const name = formData["name"];
	const email = formData["email"];
	const company = formData["company"];
	const comment = formData["comment"];
	const rating = formData["rating"];

	createTestimonialService.createTestimonial(comment, rating, name, email, company);

	window.location.reload();
});
