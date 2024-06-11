const gallery = document.querySelector('.gallery')
const filter = document.getElementById('filter')
const categoryAll = document.getElementById('category-all')

// Récupération des travaux de la bdd grâce à l'API Fetch en fonction de l'id de la categorie en paramètre
const getWorks = id => fetch('http://localhost:5678/api/works')
	.then(res => res.json())
	.then(data => {
		// si il y a un id en paramètre alors je filtre les travaux par categoriId sinon je recupère tous les travaux
		const filteredData = id ? data.filter(work => work.categoryId === id) : data

		console.log(JSON.stringify(filteredData, null, 2))


		// creation de la galerie
		createGallery(filteredData)
	})
	.catch(error => console.error(error))

// Creation de la gallerie en fonction des data en paramètre
const createGallery = data => {
	gallery.innerHTML = ''

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

// Récupération des categories de la BDDD grâce à l'API Fetch
const getCategories = () => fetch('http://localhost:5678/api/categories')
	.then(res => res.json())
	.then(data => {
		console.log(JSON.stringify(data, null, 2))
		//création des catégories
		createCatgories(data)
	})
	.catch(error => console.error(error))


// Création des filtres par catégories en fonction des data en paramètre
const createCatgories = data => {
	data.forEach(item => {

		const button = document.createElement('button')
		button.innerHTML = item.name

		// quand on clique sur une categorie alors on filtre les travaux par categoryId
		button.addEventListener('click', () => {
			const buttons = document.querySelectorAll('#filter button')
			buttons.forEach(element => element.setAttribute('class', ''))
			button.setAttribute('class', 'category-active')

			getWorks(item.id)

		})

		filter.appendChild(button)
	})
}

categoryAll.addEventListener('click', () => {
	const buttons = document.querySelectorAll('#filter button')
	buttons.forEach(element => element.setAttribute('class', ''))
	categoryAll.setAttribute('class', 'category-active')

	// affichage de tous les travaux
	getWorks()
})



fetch('http://localhost:5678/api/categories',{
    headers: {
        Accept: 'application/json'
    }
})
    .then(r => {
        if (r.ok) {
            return r.json()
        } else {
            throw new Error('Erreur serveur', {cause: r})
        }
    })
    .then(posts => {
        console.log('La liste des articles : ', posts)
    })
    .catch(e => {
        console.error('Une erreur est survenue', e)
    })


	
getWorks()
getCategories()
