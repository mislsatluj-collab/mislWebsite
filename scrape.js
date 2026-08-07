const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://www.mislsatluj.com';
const imagesDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function scrapeImages() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const images = [];

    $('img').each((i, el) => {
      let src = $(el).attr('src');
      if (src && !src.startsWith('data:') && !src.includes('svg')) {
        if (src.startsWith('/')) {
          src = url + src;
        } else if (!src.startsWith('http')) {
          src = url + '/' + src;
        }
        images.push(src);
      }
    });

    const uniqueImages = [...new Set(images)].slice(0, 10); // get top 10 unique images
    console.log(`Found ${uniqueImages.length} images to download`);

    for (let i = 0; i < uniqueImages.length; i++) {
      const imgUrl = uniqueImages[i];
      try {
        const response = await axios({
          url: imgUrl,
          method: 'GET',
          responseType: 'stream'
        });
        
        const ext = path.extname(new URL(imgUrl).pathname) || '.jpg';
        const filename = `scraped_${i}${ext}`;
        const writer = fs.createWriteStream(path.join(imagesDir, filename));
        
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        console.log(`Downloaded ${filename}`);
      } catch (err) {
        console.error(`Failed to download ${imgUrl}`, err.message);
      }
    }
    console.log('Done scraping images');
  } catch (error) {
    console.error('Error scraping:', error);
  }
}

scrapeImages();
