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
			references: data.references.map,
		};
	}
}
