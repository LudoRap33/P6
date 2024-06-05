const gallery = document.querySelector('.gallery')
const filter = document.getElementById('filter')

// Récupération des travaux de la bdd grâce à l'API Fetch
const getWorks = () => fetch('http://localhost:5678/api/works')
	.then(res => res.json())
	.then(data => {
		console.log(JSON.stringify(data, null, 2))
		// creation de la galerie
		createGallery(data)
	})
	.catch(error => console.error(error))

// Creation de la gallerie en fonction des data en paramètre
const createGallery = data => {
	data.forEach(item => {

		const figure = document.createElement('figure')

		const image = document.createElement('img')
		image.src = item.imageUrl
		image.alt = item.title

		const figCation = document.createElement('figcaption')
		figCation.innerHTML = item.title

		figure.appendChild(image)
		figure.appendChild(figCation)

		gallery.appendChild(figure)

	});
	console.log(data)
}

// Récuparation des travaux de la BDDD grâce à l'API Fetch

const getCategories = ()	=> fetch ('http://localhost:5678/api/works')
	.then(res=> resjson())
	.then(data => {
		console.log(JSON.stringify(data, null, 2))
		//création des catégories
		createCatgories(data)
	})
	.catch(error => console.erro(error))


// Création des filtres par catégories en fonction des date en  paramètre

const createCatgories = data => {
	data.forEach(item =>{

		const button = document.createElement('button')
		button.innerHTML = item.name

		filter.appendChild(button)
	})
}



getWorks()
getCategories
