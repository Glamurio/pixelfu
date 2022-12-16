// Palette
import { paletteList } from '../dicts/palettes.js'
import pixelit from '../utils/pixelit.js'

let currentPalette = 19
let images = []
let loading = false
let working = false

const pixelateWaifus = (image = undefined) => {
    if (!working) {
        working = true
        if (image && image.drawto) {
            doPixelate(image)
        } else {
            for (let px of images) {
                doPixelate(px)
            }
        }
        working = false
    }
};

const doPixelate = (px) => {
    px.setScale(blocksize.value)
        .setPalette(paletteList[currentPalette])
        .draw()
        .pixelate()
        .convertPalette()
    maxheight.value ? px.setMaxHeight(maxheight.value).resizeImage() : null;
    maxwidth.value ? px.setMaxWidth(maxwidth.value).resizeImage() : null;
}

// blocksize
const blocksize = document.querySelector("#blocksize");
blocksize.addEventListener("change", pixelateWaifus);

// maxheight
const maxheight = document.querySelector("#maxheight");
maxheight.addEventListener("change", pixelateWaifus);
// maxwidth
const maxwidth = document.querySelector("#maxwidth");
maxwidth.addEventListener("change", pixelateWaifus);

const makePaletteGradient = () => {
    //create palette of colors
    paletteList.forEach((palette, i) => {
        const option = document.createElement("div");
        option.setAttribute("data-palette", i);
        option.className = 'palette-option'
        if (i == currentPalette) {
            option.className += ' selected'
        }
        option.value = i;
        palette.forEach((elem) => {
            let div = document.createElement("div");
            div.classList = "colorblock";
            div.style.backgroundColor = `rgba(${elem[0]},${elem[1]},${elem[2]},1)`;
            option.appendChild(div);
        });
        document.getElementById("paletteselector").appendChild(option);
    });
};
makePaletteGradient();

$(document).on('click', function (e) {
    if ($(e.target).closest("#paletteselector").length === 0) {
        $("#paletteselector").removeClass('active')
        $(this).removeClass('active')
    }
});
$('#paletteselector').on('click', function() {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active')
        pixelateWaifus()
    } else {
        $(this).addClass('active')
    }
})
$('.palette-option').on('click', function() {
    $('.palette-option').removeClass('selected')
    currentPalette = $(this).attr('data-palette')
    $(this).addClass('selected')

})


$('#generate-btn').on('click', () => {
    if (!loading) {
        loading = true
        $.ajax({
            url: '/generate',
            method: 'GET',
            async: true,
            success: function(res) {
                if (res) {
                    const $container = $('#image-container')
                    $container.html('')
                    images = []

                    for (let i in res) {
                        const height = 400
                        const width = 400
                        
                        const img = new Image(height, width);
                        img.id = `input-img-${i}`
                        img.src = res[i].image;
                        img.setAttribute("data-seed", res[i].seeds);
                        $container[0].appendChild(img)

                        const canvas = document.createElement('canvas');
                        img.onload = () => {
                            canvas.id = `output-canvas-${i}`
                            canvas.height = height
                            canvas.width = width
                            $container[0].appendChild(canvas)

                            const config = {
                                from: img,
                                to: canvas,
                                scale: 32,
                                maxHeight: 128,
                                maxWidth: 128,
                            }
            
                            generatePixels(config)
                            // img.parentNode.removeChild(img);
                        }
                    }
                }
            },
            complete: function(res) {
                loading = false
            },
            error: function(err) {
                console.log(err);
            },
        });
    }
});

const generatePixels = (config) => {
    const px = new pixelit(config);
    images.push(px)
    pixelateWaifus(px)
}