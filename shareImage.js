const sharp = require('sharp');
const TextToSVG = require('text-to-svg');

const textToSVG = TextToSVG.loadSync('./static/fonts/Roboto-Regular.ttf');
const textToSVGBold = TextToSVG.loadSync('./static/fonts/Roboto-Black.ttf');

// créé les options svg par defaut. possibilité de changer la taille de la police
function createSVGOption(fontSize, color) {
  return {
    fontSize,
    anchor: 'top',
    attributes: {
      fill: color,
    },
  };
}

// permet de générer une carte entourage pour le partage. output: sortie de l'image selon le format voulue
function generateCVPreview(name, description, ambition, imagePath, output) {
  const ratio = 1.3;
  // todo: variables a mettre en options
  const imageWidth = Math.trunc(520 * ratio);
  const imageHeight = Math.trunc(272 * ratio);
  const marginTop = 14;
  const marginBottom = 20;
  const marginAmbition = 4;
  const marginTitle = 8;

  const option1 = createSVGOption(24, 'white');
  const option2 = createSVGOption(16, 'white');

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
  return sharp(imagePath)
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
    .toFile(output);
}

// const users = require('./users.json');

// console.log('OK');

// users.forEach((user) => {
//   console.log('MOKO');
//   const ambitions =
//     user.Ambitions.length > 0
//       ? user.Ambitions.map((ambition) => ambition.name.toUpperCase())
//           .slice(0, 2)
//           .join('. ')
//       : '';
//   console.log(ambitions);
//   generateCVPreview(
//     user.firstName.toUpperCase(),
//     "A besoin d'un coup de pouce pour travailler dans...",
//     ambitions,
//     `./static/img/arthur.png`,
//     `./static/img/cv/${user.url}-preview.jpg`
//   );
// });

module.export = generateCVPreview;
