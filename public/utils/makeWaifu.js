import WaifuSocket from 'waifusocket';
import sharp from 'sharp'

const ws = await new WaifuSocket().login('SFMyNTY.JUSTSOMERANDOMCOOKIE');

const grid = await ws.genGrid();

// const big = await ws.genBig(grid[0].seeds);
for (let i in grid) {
    sharp(grid[i].image)
        .resize(400, 400)
        .toFile(`./public/images/image_${i}.png`)
    .catch(err => console.log(`${err}`))
}
// await fs.writeFile(`./output/image_${Date.now()}.png`, grid[0].image);

ws.close();