const sharp = require('sharp');
const TextToSVG = require('text-to-svg');

const textToSVG = TextToSVG.loadSync('./Roboto-Regular.ttf');
const textToSVGBold = TextToSVG.loadSync('./Roboto-Black.ttf');

// genere les options svg par defaut. possibilité de changer la taille de la police
function generateSVGOption(fontSize) {
  return {
    fontSize,
    anchor: 'top',
    attributes: {
      fill: 'white',
    },
  };
}

// permet de creer une carte entourage pour le partage. output: sortie de l'image selon le format voulue
function createSharedImage(name, description, ambition, output) {
  const ratio = 1.5;

  // variables a mettre en options
  const imageWidth = 320 * ratio;
  const imageHeight = 240 * ratio;
  const marginTop = 20;
  const marginBottom = 30;
  const marginAmbition = 5;
  const marginTitle = 10;

  const option1 = generateSVGOption(24);
  const option2 = generateSVGOption(16);

  const texts = {
    // svg générés
    svg: [
      textToSVGBold.getSVG(name, option1),
      textToSVG.getSVG(description, option2),
      textToSVGBold.getSVG(ambition, option2),
    ],
    // information sur les dimentions des svg
    metrics: [
      textToSVGBold.getMetrics(name, option1),
      textToSVG.getMetrics(description, option2),
      textToSVGBold.getMetrics(ambition, option2),
    ],
  };

  // definition de la hauteur du masque de couleur entourage
  // utilisation des tailles de textes et des marges entres elles
  const overlayHeight = Math.trunc(
    marginBottom +
      marginTop +
      marginAmbition +
      marginTitle +
      texts.metrics[2].height +
      texts.metrics[1].height +
      texts.metrics[0].height
  );

  // creation de l'image
  sharp('./static/img/arthur.png')
    .resize(imageWidth, imageHeight)
    .composite([
      // masque de couleur entourage
      {
        input: {
          create: {
            width: imageWidth,
            height: overlayHeight,
            channels: 4,
            background: { r: 245, g: 95, b: 36, alpha: 0.7 }, // couleur entourage
          },
        },
        gravity: 'south',
      },
      // les 3 textes et leurs positions dans l'image
      {
        input: Buffer.from(texts.svg[0]),
        top: Math.trunc(
          imageHeight -
            (marginBottom + marginAmbition + marginTitle) -
            texts.metrics[2].height -
            texts.metrics[1].height -
            texts.metrics[0].height
        ),
        left: Math.trunc(imageWidth / 2 - texts.metrics[0].width / 2),
      },
      {
        input: Buffer.from(texts.svg[1]),
        top: Math.trunc(
          imageHeight -
            marginBottom -
            marginAmbition -
            texts.metrics[2].height -
            texts.metrics[1].height
        ),
        left: Math.trunc(imageWidth / 2 - texts.metrics[1].width / 2),
      },
      {
        input: Buffer.from(texts.svg[2]),
        top: Math.trunc(imageHeight - texts.metrics[2].height - marginBottom),
        left: Math.trunc(imageWidth / 2 - texts.metrics[2].width / 2),
      },
    ])
    .sharpen()
    .toFile(output, console.log);
}

// test
createSharedImage(
  'LAITH',
  "A besoin d'un coup de pouce pour travailler dans... ",
  "LES TRANSPORTS EN COMMUN. L'ACCUEIL",
  'output.webp'
);
