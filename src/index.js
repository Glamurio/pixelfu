import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// WaifuSocket
import WaifuSocket from 'waifusocket';
import sharp from 'sharp'

// Server
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// Pathing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static('public'))

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '/index.html'))
});
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});

app.get('/generate', async (req, res) => {
    res.send(await generateWaifus())
});

async function generateWaifus() {
    const ws = await new WaifuSocket().login('SFMyNTY.JUSTSOMERANDOMCOOKIE');
    const grid = await ws.genGrid();

    // const big = await ws.genBig(grid[0].seeds);

    let results = []
    for (let i in grid) {
        results[i] = sharp(grid[i].image)
                        .resize(400, 400)
                        // .toFile(`./public/images/image_${i}.png`)
                        .toBuffer()
                        .then(res => {
                            return {
                                image: `data:image/png;base64,${res.toString('base64')}`,
                                seeds: grid[i].seeds
                            }
                        })
    }
    ws.close();
    return await Promise.all(results)

    // await fs.writeFile(`./output/image_${Date.now()}.png`, grid[0].image);
}