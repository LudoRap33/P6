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
const btnArrowBack = document.getElementById('modal-btn-back')
const formAddPicture = document.getElementById('form-add-picture')
const aLogin = document.getElementById('a-login')
const aLogout = document.getElementById('a-logout')
// variables du DOM pour le formulaire d'ajout d'un travail
const fileUpload = document.getElementById('file-upload')
const preview = document.getElementById('preview')
const labelFileUpload = document.querySelector('#container-picture label')
const spanFileUpload = document.querySelector('#container-picture span')
const selectCategory = document.getElementById('select-category')
const inputTile = document.getElementById('title')
const formAddWork = document.querySelector('#form-add-picture form')
const submitFormAddPicture = document.querySelector('#form-add-picture input[type="submit"]')


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

const postWork = data => fetch('http://localhost:5678/api/works', {
	method: 'POST',
	headers: { Authorization: `Bearer ${localStorage.token}` },
	body: data
}).then(res => res.json())

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
// idem pour le select des categories du formulaire d'ajout de travail
const createCatgories = data => {
	selectCategory.innerHTML = ''

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

		// ajout des option de categorie au select
		const option = document.createElement('option')
		option.setAttribute('value', item.id)
		option.innerHTML = item.name
		selectCategory.appendChild(option)
	})
}

categoryAll.addEventListener('click', () => {
	const buttons = document.querySelectorAll('#filter button')
	buttons.forEach(element => element.setAttribute('class', ''))
	categoryAll.setAttribute('class', 'category-active')

	// affichage de tous les travaux
	getWorks()
})

aLogout.style.display = 'none'

/*** Mode Admin ***/
if (localStorage.token) {
	banner.style.display = 'flex'
	header.style.marginTop = '79px'
	filter.style.display = 'none'
	editModal.style.display = 'flex'
	gallery.style.marginTop = '60px'
	aLogin.style.display = 'none'
	aLogout.style.display = 'block'
}

aLogout.addEventListener('click', () => {
	localStorage.clear()
})

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

	// on affiche la preview d'origine du formulaire
	labelFileUpload.style.display = 'flex'
	spanFileUpload.style.display = 'flex'
	preview.src = "./assets/icons/picture.png"
	preview.style.height = '58px'
	preview.style.width = '58px'
	fileUpload.value = ''
	submitFormAddPicture.classList.add('disabled')
})

// Quand on clique sur la fleche retour en arrière on revient sur la modal avec la galerie des travaux
btnArrowBack.addEventListener('click', () => {
	galleryModal.style.display = 'grid'
	btnAddPicture.style.display = 'flex'
	formAddPicture.style.display = 'none'
	btnArrowBack.style.display = 'none'
})

fileUpload.addEventListener('change', () => imageIsValid())

inputTile.addEventListener('input', () => {
	const file = fileUpload.files[0]

	if (file) {
		const fileNameSplitted = file.name.split('.')
		const extension = fileNameSplitted[fileNameSplitted.length - 1].toLowerCase()

		if (file.size <= 4000000 && hasValidExtension(extension) && inputTile.value !== "") {
			submitFormAddPicture.classList.remove('disabled')
		} else {
			submitFormAddPicture.classList.add('disabled')
		}
	} else {
		submitFormAddPicture.classList.add('disabled')
	}

})

const hasValidExtension = (extension, validExtensions = ['jpg', 'jpeg', 'png']) => validExtensions.includes(extension.toLowerCase())


const imageIsValid = () => {
	const file = fileUpload.files[0]

	if (file) {
		const fileNameSplitted = file.name.split('.')
		const extension = fileNameSplitted[fileNameSplitted.length - 1].toLowerCase()
		if (file.size <= 4000000 && hasValidExtension(extension)) {
			labelFileUpload.style.display = 'none'
			spanFileUpload.style.display = 'none'
			preview.src = URL.createObjectURL(file)
			preview.style.height = 'auto'
			preview.style.width = 'auto'

			submitFormAddPicture.classList.remove('disabled')
		}
	} else {
		labelFileUpload.style.display = 'flex'
		spanFileUpload.style.display = 'flex'
		preview.src = "./assets/icons/picture.png"
		preview.style.height = '58px'
		preview.style.width = '58px'
		fileUpload.value = ''
		submitFormAddPicture.classList.add('disabled')
	}
}


formAddWork.addEventListener('submit', e => {
	// pour éviter de recharger la page
	e.preventDefault()

	const file = fileUpload.files[0]

	if (file) {
		const fileNameSplitted = file.name.split('.')
		const extension = fileNameSplitted[fileNameSplitted.length - 1].toLowerCase()
		if (file.size <= 4000000 && hasValidExtension(extension) && inputTile.value !== "") {

			const formData = new FormData()

			formData.append('image', file)
			formData.append('title', inputTile.value)
			formData.append('category', parseInt(selectCategory.value))


			// on envoie le formulaire avec les données du formData
			postWork(formData).then(() => {
				// on ferme la modal
				modal.style.display = 'none'
				// on récupère à nouveau les travaux en provenance du serveur
				return getWorks()
			})
		}
	}

})


getWorks()
getCategories()
