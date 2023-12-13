// Sélectionne les éléments du DOM par leur ID ou leur classe
const imageInput = document.getElementById('imageInput'); // Sélectionne l'élément avec l'ID "imageInput"
const exposition = document.getElementById('exposition'); // Sélectionne l'élément avec l'ID "exposition"
const cubesOn = document.querySelectorAll('.cube.on'); // Sélectionne tous les éléments avec la classe "cube" et "on"
const opacityInput = document.getElementById('opacity'); // Sélectionne l'élément avec l'ID "opacity"

// Fonction pour obtenir les couleurs dominantes d'une image
function obtenirCouleursDominantes(imageSrc, numCouleurs) {
  return new Promise((resolve, reject) => { // Crée une promesse pour gérer le chargement de l'image
    const img = new Image(); // Crée un nouvel élément image
    img.crossOrigin = 'Anonymous'; // Active la gestion des CORS (Cross-Origin Resource Sharing) pour charger des images depuis d'autres domaines
    img.src = imageSrc; // Définit la source de l'image

    img.onload = function () { // Lorsque l'image est chargée
      const canvas = document.createElement('canvas'); // Crée un élément canvas pour extraire les couleurs de l'image
      const ctx = canvas.getContext('2d'); // Obtient le contexte 2D du canvas
      canvas.width = img.width; // Définit la largeur du canvas sur la largeur de l'image
      canvas.height = img.height; // Définit la hauteur du canvas sur la hauteur de l'image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Dessine l'image sur le canvas

      const donneesImage = ctx.getImageData(0, 0, canvas.width, canvas.height).data; // Récupère les données de l'image
      const compteurCouleur = {}; // Initialise un objet pour compter les couleurs

      for (let i = 0; i < donneesImage.length; i += 4) { // Parcourt les données de l'image par groupes de 4 (rouge, vert, bleu, alpha)
        const couleur = `rgb(${donneesImage[i]}, ${donneesImage[i + 1]}, ${donneesImage[i + 2]})`; // Formate la couleur au format "rgb(r, g, b)"
        compteurCouleur[couleur] = (compteurCouleur[couleur] || 0) + 1; // Compte le nombre d'occurrences de chaque couleur
      }

      const couleursTriees = Object.keys(compteurCouleur).sort((a, b) => compteurCouleur[b] - compteurCouleur[a]); // Trie les couleurs en fonction du nombre d'occurrences, de manière décroissante

      resolve(couleursTriees.slice(0, numCouleurs)); // Renvoie les trois couleurs les plus fréquentes sous forme de tableau
    };
  });
}

imageInput.addEventListener('change', async function () { // Ajoute un écouteur d'événements pour le changement de l'élément input file
  const fichier = this.files[0]; // Récupère le fichier sélectionné par l'utilisateur

  if (fichier) { // Vérifie si un fichier a été sélectionné
    const lecteur = new FileReader(); // Crée un lecteur de fichiers

    lecteur.onload = async function (e) { // Lorsque le fichier est lu avec succès
      const URLImage = e.target.result; // Récupère l'URL de l'image

      // Obtient les trois couleurs dominantes de l'image en utilisant la fonction obtenirCouleursDominantes
      const couleursDominantes = await obtenirCouleursDominantes(URLImage, 3);

      // Affecte aléatoirement ces couleurs aux cubes avec la classe "cube.on"
      cubesOn.forEach(cube => {
        const couleurAleatoire = couleursDominantes[Math.floor(Math.random() * couleursDominantes.length)];
        cube.style.backgroundColor = couleurAleatoire;
      });

      // Met à jour l'image de fond de la section avec l'ID "exposition"
      exposition.style.backgroundImage = `url(${URLImage})`;
    };

    lecteur.readAsDataURL(fichier); // Lit le fichier en tant qu'URL de données (base64)
  }
});

// Écouteur d'événements pour mettre à jour l'opacité des cubes .on
opacityInput.addEventListener('input', function () {
    const opacite = parseFloat(this.value) / 100; // Divise la valeur par 100 pour obtenir l'opacité entre 0 et 1.0
    cubesOn.forEach(cube => {
      cube.style.opacity = opacite;
    });
  });
  
// Sélectionnez l'élément input de type color et le bouton par leurs IDs
const colorInput = document.getElementById('ut-color');
const setColorButton = document.getElementById('set-color-button');

// Ajoutez un gestionnaire d'événements au bouton "Set Color"
setColorButton.addEventListener('click', function () {
    const selectedColor = colorInput.value; // Obtenez la couleur sélectionnée par l'utilisateur
    const cubesOn = document.querySelectorAll('.cube.on'); // Sélectionnez tous les cubes "on"

    // Parcourez tous les cubes "on" et définissez leur couleur sur la couleur sélectionnée
    cubesOn.forEach(cube => {
        cube.style.backgroundColor = selectedColor;
    });
});

document.getElementById('E-bordur').addEventListener('input', function(e) {
    var borderWidth = e.target.value + 'px';
    document.getElementById('exposition').style.border = borderWidth + ' double white';
});


document.getElementById('set-dim').addEventListener('click', function() {
    var newHeight = document.getElementById('expo-h').value + 'px';
    var newWidth = document.getElementById('expo-w').value + 'px';

    var exposition = document.getElementById('exposition');
    exposition.style.height = newHeight;
    exposition.style.width = newWidth;
});
