// Sélection des éléments principaux du DOM
const imageInput = document.getElementById('imageInput');
const exposition = document.getElementById('exposition');
const opacityInput = document.getElementById('opacity');
const colorInput = document.getElementById('ut-color');
const setColorButton = document.getElementById('set-color-button');
const cubeToggle = document.getElementById('cubeToggle');

// Gestionnaire d'événements pour le changement d'image
imageInput.addEventListener('change', async function () {
    const fichier = this.files[0];
    if (fichier) {
        const lecteur = new FileReader();
        lecteur.onload = async function (e) {
            const URLImage = e.target.result;
            const couleursDominantes = await obtenirCouleursDominantes(URLImage, 3);
            document.querySelectorAll('.cube.on').forEach(cube => {
                const couleurAleatoire = couleursDominantes[Math.floor(Math.random() * couleursDominantes.length)];
                cube.style.backgroundColor = couleurAleatoire;
            });
            exposition.style.backgroundImage = `url(${URLImage})`;
        };
        lecteur.readAsDataURL(fichier);
    }
});

// Gestionnaire d'événements pour l'opacité
opacityInput.addEventListener('input', function () {
    const opacite = parseFloat(this.value) / 100;
    document.querySelectorAll('.cube.on').forEach(cube => {
        cube.style.opacity = opacite;
    });
});

// Gestionnaire d'événements pour la couleur
setColorButton.addEventListener('click', function () {
    const selectedColor = colorInput.value;
    document.querySelectorAll('.cube.on').forEach(cube => {
        cube.style.backgroundColor = selectedColor;
    });
});

// Gestionnaire d'événements pour la bordure
document.getElementById('E-bordur').addEventListener('input', function(e) {
    var borderWidth = e.target.value + 'px';
    exposition.style.border = borderWidth + ' double white';
});

// Gestionnaire d'événements pour les dimensions
document.getElementById('set-dim').addEventListener('click', function() {
    var newHeight = document.getElementById('expo-h').value + 'px';
    var newWidth = document.getElementById('expo-w').value + 'px';
    exposition.style.height = newHeight;
    exposition.style.width = newWidth;
});

// Gestionnaire d'événements pour le toggle des cubes
cubeToggle.addEventListener('change', function() {
    const cubes = document.querySelectorAll('.cube');
    if (this.checked) {
        cubes.forEach(cube => cube.addEventListener('click', toggleCubeState));
    } else {
        cubes.forEach(cube => cube.removeEventListener('click', toggleCubeState));
    }
});

// Fonction pour basculer l'état des cubes
function toggleCubeState() {
    this.classList.toggle('on');
    this.classList.toggle('off');
}

// Fonction pour obtenir les couleurs dominantes d'une image
async function obtenirCouleursDominantes(imageSrc, numCouleurs) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const donneesImage = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const compteurCouleur = {};
            for (let i = 0; i < donneesImage.length; i += 4) {
                const couleur = `rgb(${donneesImage[i]}, ${donneesImage[i + 1]}, ${donneesImage[i + 2]})`;
                compteurCouleur[couleur] = (compteurCouleur[couleur] || 0) + 1;
            }
            const couleursTriees = Object.keys(compteurCouleur).sort((a, b) => compteurCouleur[b] - compteurCouleur[a]);
            resolve(couleursTriees.slice(0, numCouleurs));
        };
    });
}
