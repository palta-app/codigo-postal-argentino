import { MultiBar, Presets } from 'cli-progress'
import { v4 as uuid } from 'uuid'
import { getRandom } from 'random-useragent'
import { chromium } from 'playwright'

import { baseURL, provinces } from './utils/constants.js'
import {
    checkOrCreateDataFiles,
    connectionFailed,
    createWriteStreams,
    evaluateFirstPTag,
    evaluateStreetsList,
    normalizeLocalityNameToHref,
} from './utils/methods.js'

async function init() {
    await checkOrCreateDataFiles()

    const { localitiesWS, streetsWS, heightWS } = createWriteStreams()
    const wStreams = [localitiesWS, streetsWS, heightWS]

    const browser = await chromium.launch()
    const context = await browser.newContext({
        userAgent: getRandom(),
    })

    const multibar = new MultiBar(
        {
            clearOnComplete: true,
            stopOnComplete: true,
            hideCursor: true,
            format: '{seeding} | [{bar}] {percentage}% | {value}/{total} | ETA:{eta_formatted}',
        },
        Presets.shades_grey
    )

    try {
        const page = await browser.newPage({ baseURL })
        const provincesBar = multibar.create()
        const localitiesBar = multibar.create()

        provincesBar.start(24, -1, {
            seeding: 'Seeding N/A',
        })

        for (const p in provinces) {
            await page.goto(provinces[p].endpoint)

            provincesBar.increment(1, {
                seeding: `Province Seeding: ${provinces[p].name}`,
            })

            if (provinces[p].stateCode === 'C') {
                continue
            } else {
                const localities = await page.evaluate(() => {
                    const nodeList = document.querySelectorAll('.cities li a')

                    return Array.from(nodeList).map((node) => ({
                        name: node.innerText,
                        href: node.href,
                    }))
                })

                const localities2 = localities.slice(336) // 336 entra a Caseros (Buenos Aires)

                localitiesBar.start(localities2.length, -1, {
                    seeding: 'Seeding N/A',
                })

                for (const locality of localities2) {
                    await page.goto(locality.href)

                    localitiesBar.increment(1, {
                        seeding: `Locality Seeding: ${locality.name}`,
                    })

                    const { firstP, strongTags } = await evaluateFirstPTag(page)

                    if (strongTags.length === 2) {
                        const CPA = strongTags.pop()

                        localitiesWS.write(
                            [uuid(), provinces[p].name, locality.name, CPA] +
                                '\n'
                        )
                    } else if (firstP.startsWith('No hemos podido')) {
                        localitiesWS.write(
                            [uuid(), provinces[p].name, locality.name, 'N/A'] +
                                '\n'
                        )
                    } else {
                        const normalizedLocality = normalizeLocalityNameToHref(
                            locality.name
                        )
                        let response = await page.goto(
                            provinces[p].endpoint +
                                `/calles-de-${normalizedLocality}`
                        )

                        while (await connectionFailed(response)) {
                            response = await page.reload()
                        }

                        const { firstP } = await evaluateFirstPTag(page)

                        if (firstP.startsWith('No hemos podido')) {
                            localitiesWS.write(
                                [
                                    uuid(),
                                    provinces[p].name,
                                    locality.name,
                                    'N/A',
                                ] + '\n'
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
                                let response = await page.goto(street.href)

                                while (await connectionFailed(response)) {
                                    response = await page.reload()
                                }

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

                                            return Array.from(
                                                nodeList,
                                                (node) => ({
                                                    ...node.dataset,
                                                })
                                            )
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
                            }
                        }
                    }
                }
            }
        }

        console.info('🌱 Seeding completed')
    } catch (error) {
        console.error(error)
        process.exit(1)
    } finally {
        wStreams.forEach((ws) => {
            ws.end()
        })

        context.close()
        browser.close()
    }
}

init()
