
 // uPLOAD fotos

 

 const PhotosUpload = {
   input:"",
   uploadLimit : 5,
   preview : document.querySelector("#photos-preview"),
   files:[],

  PhotosInput(event) {
    PhotosUpload.input = event.target
    const {files: fileList} = PhotosUpload.input

    if(PhotosUpload.LimitPhoto(event)) return

    Array.from(fileList).forEach( file => {

      PhotosUpload.files.push(file)

      const reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = ()=> {
        const image = new Image()
        image.src = String(reader.result)

        const div = PhotosUpload.CreateContainer(image)

        PhotosUpload.preview.appendChild(div)

        
      }
    })

    PhotosUpload.input.files = PhotosUpload.AllFiles()
  
  }, 
  PhotosInputChef(event) {
    PhotosUpload.input = event.target
    const {files: fileList} = PhotosUpload.input

    if(PhotosUpload.LimitPhotoChef(event)) return

    Array.from(fileList).forEach( file => {

      PhotosUpload.files.push(file)

      const reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = ()=> {
        const image = new Image()
        image.src = String(reader.result)

        const div = PhotosUpload.CreateContainer(image)

        PhotosUpload.preview.appendChild(div)

        
      }
    })

    PhotosUpload.input.files = PhotosUpload.AllFiles()
  
  },   
  CreateContainer(image) {
 const div =  document.createElement('div')
  div.classList.add('photo')
    
  div.onclick = PhotosUpload.RemovePhoto

  div.appendChild(image)

  div.appendChild(PhotosUpload.ButtonRemove())

  return div
},
  LimitPhoto(event){
    const {uploadLimit, preview, files: fileList} = PhotosUpload
    const {files: fileListInput} = PhotosUpload.input

    if(fileListInput.length > uploadLimit) {
      alert(`Limite de fotos atingido`)
      event.preventDefault()
      return true
    }

    const photoDiv = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == "photo")
        photoDiv.push(item)
    })

    const totalPhotos = fileListInput.length + photoDiv.length
    if(totalPhotos > uploadLimit){

      if(fileList.length == uploadLimit) {
      alert (`Você atigiu o limite maximo de fotos`)
      event.preventDefault()
      return true
      
    } else {
      const disp = uploadLimit - fileList.length      
      alert(`Você pode adicionar mais ${disp} fotos!`)
      event.preventDefault()
      return true
      }
    } 
  return false
    
  },
  LimitPhotoChef(event){
    let {uploadLimit, preview, files: fileList} = PhotosUpload
    const {files: fileListInput} = PhotosUpload.input
     uploadLimit = 1

    if(fileListInput.length > uploadLimit) {
      alert(`Limite de fotos atingido`)
      event.preventDefault()
      return true
    }

    const photoDiv = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == "photo")
        photoDiv.push(item)
    })

    const totalPhotos = fileListInput.length + photoDiv.length
    if(totalPhotos > uploadLimit){

      if(fileList.length == uploadLimit) {
      alert (`Você atigiu o limite maximo de fotos`)
      event.preventDefault()
      return true
      
    } else {
      const disp = uploadLimit - fileList.length      
      alert(`Você pode adicionar mais ${disp} fotos!`)
      event.preventDefault()
      return true
      }
    } 
  return false
    
  },
  AllFiles(){
    const dataTransfer = new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  ButtonRemove(){
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML="close"
    return button

    
  },
  RemovePhoto(event){
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index,1)
    PhotosUpload.input.files = PhotosUpload.AllFiles()

    photoDiv.remove()
  }, 
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode
      if(photoDiv.id){
        const removedFiles = document.querySelector('input[name="removed_files"]')
        if(removedFiles){
          removedFiles.value += `${photoDiv.id},`
        }
      }
    photoDiv.remove()  
  },

  
 };

 const ImageGallery = {
   previews: document.querySelectorAll(".gallery-preview img"),
   highlight : document.querySelector('.gallery .highlight > img'),

  setImage(event){
    const {target} = event
    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
    target.classList.add("active")

    ImageGallery.highlight.src = target.src
    Lightbox.image.src = target.src

  },
 }

 const Lightbox = {
   target:document.querySelector('.lightbox-target'),
   image:document.querySelector('.lightbox-target img'),
   closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
   open(){
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.closeButton.style.top = 0

   },
   close(){
     Lightbox.target.style.opacity = 0
     Lightbox.target.style.top = "-100%"
   },
 }




const menuItems = document.querySelectorAll(".link a")
const Edit = document.querySelector("body .bg")
const menuAdmItems = document.querySelectorAll(".linkAdm a")
const currentPage = location.pathname


    for(item of menuAdmItems) {
if(currentPage.includes(item.getAttribute("href"))){
item.classList.add("selected")
  }
}


for(item of menuAdmItems) {
if(currentPage.includes(item.getAttribute("href"))){
item.classList.add("selected")
  }
}

for(item of menuItems) {
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}

const showHides = document.getElementsByClassName('SubTitle');

for (let showHide of showHides) {
  const buttonSpan = showHide.querySelector('span');

  buttonSpan.addEventListener('click', function() {
    if (buttonSpan.innerHTML == "ESCONDER") {
      showHide.querySelector('.conteudo').classList.add('hidden');
      buttonSpan.innerHTML = "MOSTRAR"   
    } else {
      showHide.querySelector('.conteudo').classList.remove('hidden');
      buttonSpan.innerHTML = "ESCONDER"
    }
  });
}


