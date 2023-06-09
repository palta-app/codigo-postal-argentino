import { v4 as uuid } from 'uuid'
import { getRandom } from 'random-useragent'
import { chromium } from 'playwright'

import { baseURL, provinces } from './utils/constants.js'
import {
    checkOrCreateDataFiles,
    createWriteStreams,
    evaluateFirstPTag,
    evaluateStreetsList,
    normalizeLocalityNameToHref,
} from './utils/methods.js'

async function init() {
    //  TODO: SEGUIR LUEGO DEL SEEDING LA LOGICA PARA CREAR EL ARCHIVO.
    // checkOrCreateDataFiles()

    const { localitiesWS, streetsWS, heightWS } = createWriteStreams()
    const wStreams = [localitiesWS, streetsWS, heightWS]

    const browser = await chromium.launch({
        headless: false,
    })
    const context = await browser.newContext({
        userAgent: getRandom(),
    })

    const page = await browser.newPage({ baseURL })

    for (const p in provinces) {
        await page.goto(provinces[p].endpoint)

        if (provinces[p].stateCode === 'C') {
            // Recorrer las calles de CABA
            /* 
                Recorriendo...
            */
            continue
        } else {
            const localities = await page.evaluate(() => {
                const nodeList = document.querySelectorAll('.cities li a')

                return Array.from(nodeList).map((node) => ({
                    name: node.innerText,
                    href: node.href,
                }))
            })

            for (const locality of localities) {
                await page.goto(locality.href)
                const { firstP, strongTags } = await evaluateFirstPTag(page)

                if (strongTags.length === 2) {
                    const CPA = strongTags.pop()

                    localitiesWS.write(
                        [uuid(), provinces[p].name, locality.name, CPA] + '\n'
                    )
                } else if (firstP.startsWith('No hemos podido')) {
                    localitiesWS.write(
                        [uuid(), provinces[p].name, locality.name, 'N/A'] + '\n'
                    )
                } else {
                    const normalizedLocality = normalizeLocalityNameToHref(
                        locality.name
                    )
                    await page.goto(
                        provinces[p].endpoint +
                            `/calles-de-${normalizedLocality}`
                    )

                    const { firstP } = await evaluateFirstPTag(page)

                    if (firstP.startsWith('No hemos podido')) {
                        localitiesWS.write(
                            [uuid(), provinces[p].name, locality.name, 'N/A'] +
                                '\n'
                        )
                    } else {
                        const localityId = uuid()

                        localitiesWS.write(
                            [
                                localityId,
                                provinces[p].name,
                                locality.name,
                                'N/A',
                            ] + '\n'
                        )

                        const streets = await evaluateStreetsList(page)

                        for (const street of streets) {
                            await page.goto(street.href)

                            const { firstP, strongTags } =
                                await evaluateFirstPTag(page)

                            const type = firstP.split(' ').shift()

                            if (strongTags.length === 2) {
                                const CPA = strongTags.shift()

                                streetsWS.write(
                                    [
                                        uuid(),
                                        type,
                                        street.name,
                                        localityId,
                                        locality.name,
                                        CPA,
                                    ] + '\n'
                                )
                            } else {
                                const streetId = uuid()

                                streetsWS.write(
                                    [
                                        streetId,
                                        type,
                                        street.name,
                                        localityId,
                                        locality.name,
                                        'N/A',
                                    ] + '\n'
                                )

                                const arrStreets = await page.evaluate(
                                    function () {
                                        const nodeList =
                                            document.querySelectorAll(
                                                'tbody tr'
                                            )

                                        return Array.from(nodeList, (node) => ({
                                            ...node.dataset,
                                        }))
                                    }
                                )

                                arrStreets.forEach((street) => {
                                    heightWS.write(
                                        [
                                            streetId,
                                            street.desde,
                                            street.hasta,
                                            street.cpa,
                                        ] + '\n'
                                    )
                                })
                            }

                            break
                        }
                    }
                }

                break
            }
        }

        break
    }

    wStreams.forEach((ws) => {
        ws.end()
    })

    context.close()
    browser.close()
}

init()
