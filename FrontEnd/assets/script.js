/*** Variables pour intéragir avec le DOM (les éléments HTML en statique) */
const gallery = document.querySelector('.gallery')
const filter = document.getElementById('filter')
const categoryAll = document.getElementById('category-all')
const banner = document.querySelector('.banner')
const header = document.querySelector('header')
const editModal = document.getElementById('edit-modal')
const modal = document.getElementById('modal')
const galleryModal = document.querySelector('#modal .gallery')
const modalBtnClose = document.getElementById('modal-btn-close')
const btnAddPicture = document.getElementById('btn-add-picture')
const formAddPicture = document.getElementById('form-add-picture')
const btnArrowBack = document.getElementById('modal-btn-back')
// variables du DOM pour le formulaire d'ajout d'un travail
const fileUpload = document.getElementById('file-upload')
const preview = document.getElementById('preview')
const labelFileUpload = document.querySelector('#container-picture label')
const spanFileUpload = document.querySelector('#container-picture span')

// Récupération des travaux de la bdd grâce à l'API Fetch en fonction de l'id de la categorie en paramètre
const getWorks = id => fetch('http://localhost:5678/api/works')
	.then(res => res.json())
	.then(data => {
		// si il y a un id en paramètre alors je filtre les travaux par categoriId sinon je recupère tous les travaux
		const filteredData = id ? data.filter(work => work.categoryId === id) : data

		console.log(JSON.stringify(filteredData, null, 2))


		// creation des galeries
		createGallery(filteredData)
	})
	.catch(error => console.error(error))

const deleteWork = id => fetch(`http://localhost:5678/api/works/${id}`, {
	method: 'DELETE',
	headers: { Authorization: `Bearer ${localStorage.token}` }
})

// Creation des galeries de la page d'accueil et de la modal en fonction des data en paramètre
const createGallery = data => {
	gallery.innerHTML = ''
	galleryModal.innerHTML = ''

	data.forEach(item => {

		// Création du DOM pour la galerie de la page d'accueil
		const figure = document.createElement('figure')

		const image = document.createElement('img')
		image.src = item.imageUrl
		image.alt = item.title

		const figCation = document.createElement('figcaption')
		figCation.innerHTML = item.title

		figure.appendChild(image)
		figure.appendChild(figCation)

		gallery.appendChild(figure)


		// Création du DOM pour la galerie de la modal
		const figureModal = document.createElement('figure')

		const imageModal = document.createElement('img')
		imageModal.src = item.imageUrl
		imageModal.alt = item.title

		figureModal.appendChild(imageModal)

		// ajout dynamique de l'icon de la poubelle
		const garbageIcon = document.createElement('img')
		garbageIcon.alt = 'garbage icon'
		garbageIcon.src = './assets/icons/garbage.png'
		garbageIcon.setAttribute('class', 'icon garbage-icon')
		figureModal.appendChild(garbageIcon)

		garbageIcon.addEventListener('click', () => {
			deleteWork(item.id)
				.then(() => {
					console.log(`Le travail id:${item.id} a bien été supprimé`)
					return getWorks()
				})
		})

		galleryModal.appendChild(figureModal)

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

/*** Mode Admin ***/
if (localStorage.token) {
	banner.style.display = 'flex'
	header.style.marginTop = '79px'
	filter.style.display = 'none'
	editModal.style.display = 'flex'
	gallery.style.marginTop = '60px'
}

/*** Modal ****/

// On créé l'événement pour ouvrir la modal quand on clique sur le bouton 'Mode édition'
editModal.addEventListener('click', () => {
	modal.style.display = 'block'
})

// On créé l'évément pour fermer la modal
modalBtnClose.addEventListener('click', () => {
	modal.style.display = 'none'
})

// Quand on clique sur le bouton ajouter une photo alors on affiche le formulaire pour ajouter une image
btnAddPicture.addEventListener('click', () => {
	galleryModal.style.display = 'none'
	btnAddPicture.style.display = 'none'
	formAddPicture.style.display = 'block'
	btnArrowBack.style.display = 'flex'
})

// Quand on clique sur la fleche retour en arrière on revient sur la modal avec la galerie des travaux
btnArrowBack.addEventListener('click', () => {
	galleryModal.style.display = 'grid'
	btnAddPicture.style.display = 'flex'
	formAddPicture.style.display = 'none'
	btnArrowBack.style.display = 'none'
})

fileUpload.addEventListener('change', () => {
	const file = fileUpload.files[0]

	labelFileUpload.style.display = 'none'
	spanFileUpload.style.display = 'none'
	preview.src = URL.createObjectURL(file)
	preview.style.height = 'auto'
	preview.style.width = 'auto'
})

const formData = new FormData();

formData.append("username", "Sophie");
// le numéro 123456 est converti immédiatement en chaîne "123456"
formData.append("accountnum", 123456); 



// fichier HTML choisi par l'utilisateur

formData.append("userfile", fileInputElement.files[0]);

// objet JavaScript de type fichier

const content = '<q id="a"><span id="b">hey!</span></q>';

// le corps du nouveau fichier

const blob = new Blob([content], { type: "text/xml" });

getWorks()
getCategories()
