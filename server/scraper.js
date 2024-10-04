const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Directories to scrape
const VIDEO_DIRECTORIES = [
  "https://ocean.marcus.pw:8008/RileyReid/%5BSiterip%5D%20Riley%20Reid%20-%20ReidMyLips.com%20%5B2019-12-09%5D/",
  "https://ocean.marcus.pw:8008/JAV/%5BBEB016%5D%20JULIA%20%28Uncensored%20Leak%29%20%5B720p%5D/",
  "https://ocean.marcus.pw:8008/Onlyfans/%5BOnlyFans.com%5D%20Anri%20Okita%20%28%40anriokita_real%29%20%5B2019-02-13%5D/",
  "https://ocean.marcus.pw:8008/Onlyfans/%5BOnlyFans.com%5D%20Daneilley%20Ayala%20%28%40danyellay%29%20%5B2019-12-14%5D/video/",
  "https://ocean.marcus.pw:8008/Packs/%5BPornhubPremium%5D%20Purple%20Bitch%20%5BMegaPack%5D/"
];

// Function to scrape a single directory
async function scrapeDirectory(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Find all video links
  const videoLinks = $('a').map((_, link) => {
    const href = $(link).attr('href');
    if (href.endsWith('.mp4')) {
      return url + href;
    }
    return null;
  }).get();

  return videoLinks;
}

// Function to download a file
async function downloadFile(url, outputDir) {
  const fileName = path.basename(url);
  const filePath = path.join(outputDir, fileName);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Main function to scrape and download videos
async function scrapeAndDownload() {
  for (const directory of VIDEO_DIRECTORIES) {
    console.log(`Scraping: ${directory}`);
    const videoLinks = await scrapeDirectory(directory);

    const outputDir = path.join(__dirname, 'downloads', path.basename(directory));
    await fs.ensureDir(outputDir);

    for (const videoLink of videoLinks) {
      console.log(`Downloading: ${videoLink}`);
      await downloadFile(videoLink, outputDir);
    }
  }
}

scrapeAndDownload().catch(console.error);
