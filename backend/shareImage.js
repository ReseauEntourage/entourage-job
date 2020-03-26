const sharp = require('sharp');
const TextToSVG = require('text-to-svg');

const textToSVG = TextToSVG.loadSync('./static/fonts/Roboto-Regular.ttf');
const textToSVGBold = TextToSVG.loadSync('./static/fonts/Roboto-Black.ttf');

// créé les options svg par defaut. possibilité de changer la taille de la police
const createSVGOption = (fontSize, color) => ({
  fontSize,
  anchor: 'top',
  attributes: {
    fill: color,
  },
  // maxWidth: 100,
  // textOverflow: 'ellipsis',
});

// permet de générer une carte entourage pour le partage. output: sortie de l'image selon le format voulue
function generateCVPreview({ name, description, ambitions, input }) {
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

  const texts = ((nameText, descriptionText, ambitionText) => ({
    // svg générés
    svg: [
      textToSVGBold.getSVG(nameText, option1),
      textToSVG.getSVG(descriptionText, option2),
      textToSVGBold.getSVG(ambitionText, option2),
    ],
    // information sur les dimentions des svg
    metrics: [
      textToSVGBold.getMetrics(nameText, option1),
      textToSVG.getMetrics(descriptionText, option2),
      textToSVGBold.getMetrics(ambitionText, option2),
    ],
  }))(
    name.toUpperCase(),
    description,
    ambitions
      .slice(0, 2)
      .map((text) => text.toUpperCase())
      .join('. ')
  );

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
  return sharp(input)
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
    .sharpen();
}

// permet de générer une carte entourage pour le partage. output: sortie de l'image selon le format voulue
const createCandidatPreviewV2 = async (
  name,
  gender,
  description,
  skills,
  ambitions,
  image
) => {
  const cardPadding = 20; // 10;
  const cardCote = 450; // 325
  const footerHeight = cardPadding * 4;
  const cardHeight = cardCote + footerHeight;
  const cardWidth = cardCote + cardPadding * 2;
  const cadranHeight = Math.trunc(cardCote * 0.75);
  const cadranWidth = Math.trunc(cardWidth / 2);
  const cadranMargin = 10;
  const logoHeight = footerHeight * 0.8;

  const ratio = 1;
  // todo: variables a mettre en options
  const imageWidth = cardWidth * ratio; // Math.trunc(520 * ratio);
  const imageHeight = cardHeight * ratio; // Math.trunc(272 * ratio);

  // recuperation du logo
  const logo = sharp('./static/img/01-linkedout-orange-complet.png')
    .resize({ height: logoHeight })
    .png();
  const logoBuffer = await logo.toBuffer();
  const logoWidth = await logo
    .metadata()
    .then((logoMeta) =>
      Math.trunc((logoHeight * logoMeta.width) / logoMeta.height)
    );

  // text
  const option1 = createSVGOption(cardWidth * 0.06, '#000');
  const option2 = createSVGOption(cardWidth * 0.04, '#666');
  const option3 = createSVGOption(cardWidth * 0.04, '#f55f24');
  const option4 = createSVGOption(cardWidth * 0.035, '#fff');
  // {
  //   fontSize: cardWidth * 0.04,
  //   anchor: 'top',
  //   attributes: {
  //     fill: '#666',
  //     maxWidth: 10,
  //     textOverflow: 'ellipsis',
  //   },
  // };

  const nameSharp = sharp(
    Buffer.from(textToSVGBold.getSVG(name, option1))
  ).png();
  const nameBuffer = await nameSharp.toBuffer();
  const nameHeight = await nameSharp
    .metadata()
    .then((logoMeta) => logoMeta.height);

  const descriptionSharp = sharp(
    Buffer.from(textToSVG.getSVG(description, option2))
  ).png();
  const descriptionBuffer = await descriptionSharp.toBuffer();
  const descriptionHeight = await descriptionSharp
    .metadata()
    .then((logoMeta) => logoMeta.height);

  // Caption
  const caption = `${gender === 0 ? 'Il' : 'Elle'} souhaite travailler dans :`;
  const captionSharp = sharp(
    Buffer.from(textToSVG.getSVG(caption, option2))
  ).png();
  const captionBuffer = await captionSharp.toBuffer();
  const captionHeight = await captionSharp
    .metadata()
    .then((logoMeta) => logoMeta.height);
  const captionMargin = 5;
  // Skills
  const skillsSharp = skills
    .slice(0, 2)
    .map((text) =>
      sharp(Buffer.from(textToSVGBold.getSVG(text.toLowerCase(), option3)))
    );
  const skillBuffers = await Promise.all(
    skillsSharp.map((skill) => skill.toBuffer())
  );
  const skillHeights = await Promise.all(
    skillsSharp.map((skill) => skill.metadata().then(({ height }) => height))
  );
  const skillMargins = 5;

  // Ambition
  const ambitionSharps = ambitions
    .slice(0, 2)
    .map((text) =>
      sharp(Buffer.from(textToSVGBold.getSVG(text.toLowerCase(), option4)))
    );
  const ambitionBuffers = await Promise.all(
    ambitionSharps.map((amb) => amb.toBuffer())
  );
  const ambitionHeights = await Promise.all(
    ambitionSharps.map((amb) =>
      amb.metadata().then((logoMeta) => logoMeta.height)
    )
  );
  const ambitionWidths = await Promise.all(
    ambitionSharps.map((amb) =>
      amb.metadata().then((logoMeta) => logoMeta.width)
    )
  );
  const ambitionMargins = 5;
  const ambitionPadding = 2;
  // cadran
  const cadranBuffer = await sharp({
    create: {
      width: cadranWidth,
      height: cadranHeight,
      channels: 3,
      background: '#FFF',
    },
  })
    .composite([
      // les 3 textes et leurs positions dans l'image
      {
        input: nameBuffer,
        top: cadranMargin,
        left: 0,
      },
      // description
      // {
      //   input: descriptionBuffer,
      //   top: 10 + nameHeight + 5,
      //   left: 0,
      // },
      // Skills text
      ...skillBuffers.map((input, index) => ({
        input,
        top:
          cadranMargin +
          nameHeight +
          index * skillHeights[0] +
          descriptionHeight,
        left: 0,
      })),
      // Ambition caption
      {
        input: captionBuffer,
        top:
          cadranHeight -
          captionHeight -
          ambitionHeights.reduce((acc, cur) => acc + cur + ambitionMargins) -
          cadranMargin -
          captionMargin,
        left: 0,
      },
      // ambition background
      ...ambitionHeights.map((ambitionHeight, index) => ({
        input: {
          create: {
            width: ambitionWidths[index] + 10 * 2,
            height: ambitionHeight + ambitionPadding,
            channels: 3,
            background: '#f55f24',
          },
        },
        top:
          cadranHeight -
          ambitionHeights.reduce((acc, cur, ih) => {
            if (index < ih) {
              return acc;
            }
            return acc + cur + ambitionMargins;
          }) -
          cadranMargin -
          ambitionPadding / 2,
        left: 0,
      })),
      // ambition text
      ...ambitionBuffers.map((input, index) => ({
        input,
        top:
          cadranHeight -
          ambitionHeights.reduce((acc, cur, ih) => {
            if (index < ih) {
              return acc;
            }
            return acc + cur + ambitionMargins;
          }) -
          cadranMargin,
        left: 10,
      })),
    ])
    .png()
    .toBuffer();

  // creation de l'image
  const cardSharp = sharp({
    create: {
      width: cardWidth,
      height: cardHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      // CADRAN
      // haut
      {
        input: {
          create: {
            width: cardWidth,
            height: cardPadding,
            channels: 3,
            background: '#FFF',
          },
        },
        blend: 'over',
        top: 0,
        left: 0,
      },
      // gauche
      {
        input: {
          create: {
            width: cardPadding,
            height: cardCote - cardPadding,
            channels: 3,
            background: '#FFF',
          },
        },
        blend: 'over',
        top: cardPadding,
        left: 0,
      },
      // droite
      {
        input: {
          create: {
            width: cardPadding,
            height: cardCote - cardPadding,
            channels: 3,
            background: '#FFF',
          },
        },
        blend: 'over',
        top: cardPadding,
        left: cardCote + cardPadding,
      },
      // bas
      {
        input: {
          create: {
            width: cardWidth,
            height: footerHeight,
            channels: 3,
            background: '#FFF',
          },
        },
        blend: 'over',
        top: cardCote,
        left: 0,
      },
      // ZONE INFORMATION
      {
        input: cadranBuffer,
        blend: 'over',
        top: Math.trunc(cardCote / 2 + cardPadding / 2 - cadranHeight / 2),
        left: cardPadding,
      },
      // logo linkedout
      {
        input: logoBuffer,
        blend: 'over',
        top: cardHeight - footerHeight / 2 - logoHeight / 2,
        left: cardWidth / 2 - logoWidth / 2,
      },
    ])
    .png();
  const cardBuffer = await cardSharp.toBuffer();

  return sharp(image)
    .resize(imageWidth, imageHeight)
    .composite([
      {
        input: cardBuffer,
        blend: 'over',
        top: Math.trunc(imageHeight / 2 - cardHeight / 2),
        left: Math.trunc(imageWidth / 2 - cardWidth / 2),
      },
    ])
    .sharpen();
};

const fs = require('fs');

const exec = () => {
  fs.readFile('./static/img/arthur.png', (err, data) => {
    if (data) {
      createCandidatPreviewV2(
        'Johann'.toUpperCase(),
        0,
        'Un monstre moi? \nMais pas du tout !\n Je suis... Un vrai démon !',
        ['Enjoué', 'Déterminé'],
        ['Le jardinage', 'Les espaves verts', 'La lotterie'],
        data
      ).then((sharp) =>
        sharp
          .png()
          .toBuffer()
          .then((buffer) => {
            fs.writeFile('./profil-preview.jpeg', buffer, console.log);
          })
      );
    }
  });
};

exec();

module.exports = generateCVPreview;
