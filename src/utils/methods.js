import fs, { promises } from 'fs'
import { dataPaths } from './constants.js'

async function getFileSizeInKbs(filePath) {
    try {
        const stats = await promises.stat(filePath)

        return stats.size / 1024
    } catch (error) {
        console.error(error)
    }
}

export function checkOrCreateDataFiles() {
    // TODO: Hacer esto para cada uno de los archivos
    // const fileSizeInKbs = getFileSizeInKbs()

    const archivosCSV = [
        {
            name: 'localidades.csv',
            headers: ['id', 'provincia', 'localidad', 'cpa'],
            path: dataPaths.localities,
        },
        {
            name: 'calles.csv',
            headers: [
                'id',
                'tipo',
                'nombre',
                'localidadId',
                'localidad',
                'cpa',
            ],
            path: dataPaths.streets,
        },
        {
            name: 'altura.csv',
            headers: ['calleId', 'desde', 'hasta', 'cpa'],
            path: dataPaths.height,
        },
    ]

    archivosCSV.forEach((file) => {
        const { name, path, headers } = file
        const ws = fs.createWriteStream(path, { flags: 'a' })

        ws.write(headers + '\n')
        ws.end()
        ws.on('finish', () => console.log(`Archivo ${name} creado con éxito.`))
        ws.on('error', (error) => console.error(error))
    })
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
 * */

export async function evaluateFirstPTag(page) {
    const items = await page.evaluate(() => {
        const firstP = document.querySelector('p')

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
 * */

export async function evaluateStreetsList(page) {
    const rawStreets = await page.evaluate(() => {
        const nodeList = document.querySelectorAll('.three_columns li a')

        return Array.from(nodeList).map((node) => ({
            name: node.innerText,
            href: node.href,
        }))
    })

    const uniqueStreets = new Set(rawStreets.map((street) => street.name))

    return Array.from(uniqueStreets, (name) =>
        rawStreets.find((street) => street.name === name)
    )
}
