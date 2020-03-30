const sharp = require('sharp');
const TextToSVG = require('text-to-svg');

const textToSVG = TextToSVG.loadSync('./static/fonts/Roboto-Regular.ttf');
const textToSVGBold = TextToSVG.loadSync('./static/fonts/Roboto-Black.ttf');

// TOOLS
const buildLines = async (lines, font, option) => {
  const sharpDatas = lines.map((line) =>
    sharp(Buffer.from(font.getSVG(line, option)))
  );
  const buffers = await Promise.all(
    sharpDatas.map((sharpData) => sharpData.toBuffer())
  );
  const metadatas = await Promise.all(
    sharpDatas.map((sharpData) =>
      sharpData.metadata().then((metadata) => metadata)
    )
  );
  const widths = metadatas.map(({ width }) => width);
  const heights = metadatas.map(({ height }) => height);
  return {
    buffers,
    heights,
    widths,
  };
};
const buildLine = async (line, font, option) => {
  const sharpData = sharp(Buffer.from(font.getSVG(line, option))).png();
  const buffer = await sharpData.toBuffer();
  const { width, height } = await sharpData.metadata();
  return {
    buffer,
    height,
    width,
  };
};
// créé les options svg par defaut. possibilité de changer la taille de la police
const createSVGOption = (fontSize, color) => ({
  fontSize,
  anchor: 'top',
  attributes: {
    fill: color,
  },
});

const ellipsisByWord = (text, getWidth, maxWidth, maxLine) => {
  const lines = [];
  let line = [];
  const words = text.split(' ');

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    // Specialement pour creer simplement des sauts de lignes
    if (word === '\n') {
      lines.push(line.join(' '));
      line = [];
      continue;
    }
    // j'ajoute le mot ou cree une nouvelle ligne selon si on depasse la taille max
    if (getWidth([...line, word].join(' ')) >= maxWidth) {
      if (lines.length >= maxLine) {
        do {
          line = [...line.slice(0, line.length - 1), `...`];
        } while (getWidth(line.join(' ')) >= maxWidth);
        lines.push(line.join(' '));
        line = [];
        break;
      } else {
        lines.push(line.join(' '));
        line = [word];
      }
    } else {
      line.push(word);
    }
  }

  if (line.length > 0) {
    lines.push(line.join(' '));
  }

  return lines;
};

const ellipsisByChar = (text, getWidth, maxWidth) => {
  let line = '';
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (getWidth(line + char) >= maxWidth) {
      // on enleve un charatere tant que ça ne passe pas en largeur
      do {
        line = `${line.slice(0, line.length - 2)}...`;
      } while (getWidth(line) >= maxWidth);
      return line;
    }
    line += char;
  }
  return line;
};

// GENERATION
// Version 1 de la generation d'image
// permet de générer une carte entourage pour le partage. output: sortie de l'image selon le format voulue
function generateCVPreview(image, name, description, ambitions) {
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
  return sharp(image)
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
  image,
  name,
  description,
  ambitions,
  skills,
  gender
) => {
  const getCadran = async (cadranWidth, cadranHeight, cadranMargin) => {
    const fontRatio = cadranWidth * 2;
    // text
    const options = [
      createSVGOption(fontRatio * 0.06, '#000'),
      createSVGOption(fontRatio * 0.04, '#666'),
      createSVGOption(fontRatio * 0.04, '#f55f24'),
      createSVGOption(fontRatio * 0.035, '#fff'),
    ];

    // Name
    const { buffer: nameBuffer, height: nameHeight } = await buildLine(
      ellipsisByChar(
        name.toUpperCase(),
        (line) => textToSVG.getMetrics(line, options[0]).width,
        cadranWidth
      ),
      textToSVGBold,
      options[0]
    );

    // description
    const descriptionMargin = 10;
    const {
      buffers: descriptionBuffer,
      heights: descriptionHeight,
    } = await buildLines(
      ellipsisByWord(
        description && description.length > 0
          ? description
          : "Il cherche un job pour s'en sortir.",
        (tmp) => textToSVG.getMetrics(tmp, options[1]).width,
        cadranWidth,
        3
      ),
      textToSVG,
      options[1]
    );

    // Skills
    const skillMargins = 5;
    const { buffers: skillBuffers, heights: skillHeights } = await buildLines(
      skills
        .slice(0, 2)
        .map((text) =>
          ellipsisByChar(
            text.toLowerCase(),
            (line) => textToSVGBold.getMetrics(line, options[2]).width,
            cadranWidth
          )
        ),
      textToSVGBold,
      options[2]
    );

    // Caption
    const captionMargin = 5;
    const {
      buffers: captionBuffers,
      heights: captionHeights,
    } = await buildLines(
      ellipsisByWord(
        ambitions && ambitions.length > 0
          ? `${gender === 0 ? 'Il' : 'Elle'} souhaite \n travailler dans :`
          : `${gender === 0 ? 'Il' : 'Elle'} reste ${
              gender === 0 ? 'ouvert' : 'ouverte'
            } à toute autre proposition.`,
        (tmp) => textToSVG.getMetrics(tmp, options[1]).width,
        cadranWidth,
        3
      ),
      textToSVG,
      options[1]
    );

    // Ambition
    const ambitionMargins = 5;
    const ambitionPaddingTopBottom = 2;
    const ambitionPaddingLeftRight = 20;
    const {
      buffers: ambitionBuffers,
      heights: ambitionHeights,
      widths: ambitionWidths,
    } = await buildLines(
      ambitions
        .slice(0, 2)
        .map((text) =>
          ellipsisByChar(
            text.toLowerCase(),
            (line) => textToSVGBold.getMetrics(line, options[2]).width,
            cadranWidth
          )
        ),
      textToSVGBold,
      options[3]
    );

    // cadran
    return sharp({
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
        ...descriptionBuffer.map((input, index) => ({
          input,
          top:
            cadranMargin +
            nameHeight +
            descriptionHeight.reduce((acc, cur, ih) => {
              if (index <= ih) {
                return acc;
              }
              return acc + cur;
            }, 0),
          left: 0,
        })),
        ...skillBuffers.map((input, index) => ({
          input,
          top:
            cadranMargin +
            nameHeight +
            descriptionMargin +
            skillHeights.reduce((acc, cur, ih) => {
              if (index <= ih) {
                return acc;
              }
              return acc + cur + skillMargins;
            }, 0) +
            descriptionHeight.reduce((acc, val) => acc + val, 0),
          left: 0,
        })),
        // inverse, on commence du bas vers le haut
        // Caption
        ...captionBuffers.map((input, index) => ({
          input,
          top:
            cadranHeight -
            captionHeights.reduce((acc, cur, ih) => {
              if (index <= ih) {
                return acc + cur;
              }
              return acc;
            }, 0) -
            ambitionHeights.reduce(
              (acc, cur) => acc + cur + ambitionMargins,
              0
            ) -
            cadranMargin -
            captionMargin,
          left: 0,
        })),
        // ambition background
        ...ambitionHeights.map((ambitionHeight, index) => ({
          input: {
            create: {
              width: ambitionWidths[index] + ambitionPaddingLeftRight,
              height: ambitionHeight + ambitionPaddingTopBottom,
              channels: 3,
              background: '#f55f24',
            },
          },
          top:
            cadranHeight -
            ambitionHeights.reduce((acc, cur, ih) => {
              if (index <= ih) {
                return acc + cur + ambitionMargins;
              }
              return acc;
            }, 0) -
            cadranMargin -
            ambitionPaddingTopBottom / 2,
          left: 0,
        })),
        // ambition text
        ...ambitionBuffers.map((input, index) => ({
          input,
          top:
            cadranHeight -
            ambitionHeights.reduce((acc, cur, ih) => {
              if (index <= ih) {
                return acc + cur + ambitionMargins;
              }
              return acc;
            }, 0) -
            cadranMargin,
          left: ambitionPaddingLeftRight / 2,
        })),
      ])
      .png()
      .toBuffer();
  };
  const getCard = async (cardCote, cardPadding) => {
    const footerHeight = cardPadding * 4;
    const cardHeight = cardCote + footerHeight;
    const cardWidth = cardCote + cardPadding * 2;
    const cadranHeight = Math.trunc(cardCote * 0.75);
    const cadranWidth = Math.trunc(cardWidth / 2);
    const cadranMargin = 10;
    const logoHeight = footerHeight * 0.8;

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
    const cadranBuffer = await getCadran(
      cadranWidth,
      cadranHeight,
      cadranMargin
    );

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
          top: Math.trunc(cardHeight - footerHeight / 2 - logoHeight / 2),
          left: Math.trunc(cardWidth / 2 - logoWidth / 2),
        },
      ])
      .png();
    return {
      buffer: await cardSharp.toBuffer(),
      height: cardHeight,
      width: cardWidth,
    };
  };
  // todo: variables a mettre en options
  const ratio = 2.1;
  const imageWidth = Math.trunc(520 * ratio);
  const imageHeight = Math.trunc(272 * ratio);
  const cardPadding = 20;
  const cardCote = 450;
  const {
    buffer: cardBuffer,
    height: cardHeight,
    width: cardWidth,
  } = await getCard(cardCote, cardPadding);

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

module.exports = createCandidatPreviewV2;
