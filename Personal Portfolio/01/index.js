const projectItems = [
	{
		title: "Project 1",
		URL: "#",
		Description: "Description of what project 1 does and what I learned doing it.",
	},
	{
		title: "Project 2",
		URL: "#",
		Description: "Description of what project 2 does and what I learned doing it.",
	},
	{
		title: "Project 3",
		URL: "#",
		Description: "Description of what project 3 does and what I learned doing it.",
	},
	{
		title: "Project 4",
		URL: "#",
		Description: "Description of what project 4 does and what I learned doing it.",
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
	projectListedItem.textContent = projectTitle;

	const projectLiLink = document.createElement("a");
	projectLiLink.href = projectURL;
	projectLiLink.textContent = projectTitle;
	projectLiLink.target = "_blank";

	const projectLiPara = document.createElement("p");
	projectLiPara.textContent = projectDesc;

	projectListedItem.appendChild(projectLiLink);
	projectListedItem.appendChild(projectLiPara);

	projectList.appendChild(projectListedItem);
});

projectsDiv.appendChild(projectList);
