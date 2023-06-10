import fs, { promises } from 'fs'
import { dataPaths, dataFolderPath, csvFiles } from './constants.js'

function dataFolderExists() {
    try {
        fs.accessSync(dataFolderPath)
        return true
    } catch (error) {
        return false
    }
}

async function getFilesSizeInMbs() {
    if (!dataFolderExists()) return

    const arrPaths = Object.values(dataPaths)

    const arrSizes = await Promise.all(
        arrPaths.map(async (path) => {
            const { size } = await promises.stat(path)

            return size / 1048576
        })
    )

    return arrSizes.reduce((acc, curr) => acc + curr, 0)
}

export async function checkOrCreateDataFiles() {
    const totalFileSize = await getFilesSizeInMbs()

    if (!totalFileSize) {
        await promises.mkdir(dataFolderPath)
    }

    if (totalFileSize < 5 || !totalFileSize) {
        csvFiles.forEach((file) => {
            const { name, path, headers } = file
            const ws = fs.createWriteStream(path)

            ws.write(headers + '\n')
            ws.end()
            ws.on('finish', () =>
                console.log(`Archivo ${name} creado con éxito.`)
            )
            ws.on('error', (error) => console.error(error))
        })
    }
}

export function createWriteStreams() {
    return {
        localitiesWS: fs.createWriteStream(dataPaths.localities, {
            flags: 'a',
        }),
        streetsWS: fs.createWriteStream(dataPaths.streets, { flags: 'a' }),
        heightWS: fs.createWriteStream(dataPaths.height, { flags: 'a' }),
    }
}

export function normalizeLocalityNameToHref(str) {
    return str
        .toLowerCase()
        .split(' ')
        .join('-')
        .replace(/ñ|ü/g, (lyric) => (lyric === 'ñ' ? 'n' : 'u'))
}

/**
 * @param {import('playwright').Page} page - Instancia de la clase "Page".
 * @returns
 * */

export async function evaluateFirstPTag(page) {
    const items = await page.evaluate(() => {
        let firstP = null

        while (!firstP) {
            firstP = document.querySelector('div p')
        }

        const strongTags = Array.from(
            firstP.querySelectorAll('strong'),
            (tag) => tag.innerText
        )

        return {
            firstP: firstP.innerText,
            strongTags,
        }
    })

    return items
}

/**
 * @param {import('playwright').Page} page - Instancia de la clase "Page".
 * @returns
 * */

export async function evaluateStreetsList(page) {
    const rawStreets = await page.evaluate(() => {
        const nodeList = document.querySelectorAll('.three_columns li a')

        return Array.from(nodeList).map((node) => ({
            name: node.innerText.split(' ').slice(1).join(' '),
            href: node.href,
        }))
    })

    const uniqueStreets = new Set(rawStreets.map((street) => street.name))

    return Array.from(uniqueStreets, (name) =>
        rawStreets.find((street) => street.name === name)
    )
}

/**
 *
 * @param {import('playwright').Response} res - Instancia de la clase "Response".
 * @returns
 */

export async function connectionFailed(res) {
    const failed = (await res.text()).includes('Error Connect')

    return !res.ok() || failed
}
