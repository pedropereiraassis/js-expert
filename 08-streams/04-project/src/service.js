import { createReadStream, createWriteStream, statSync } from 'fs'
import { readdir } from 'fs/promises'
import { join } from 'path'


import { pipeline } from 'stream/promises';

import split from 'split2'
import StreamConcat from 'stream-concat'


export default class Service {
    #years
    #likes
    #lineChartData
    #outputFinal
    #tecnologiesInAnalysis
    #defaultInputFolder

    constructor({ years, likes, lineChartData, outputFinal, defaultInputFolder, tecnologiesInAnalysis }) {
        this.#years = years
        this.#likes = likes
        this.#lineChartData = lineChartData
        this.#outputFinal = outputFinal
        this.#tecnologiesInAnalysis = tecnologiesInAnalysis
        this.#defaultInputFolder = defaultInputFolder
    }
    // 1
    async prepareStreams(folder) {
        const files = (await readdir(folder))//.slice(0, 100)
        const filesSize = this.getFilesSize(files, folder)

        const streams = files.map(
            file => createReadStream(join(folder, file))
        )

        const stream = new StreamConcat(streams)
        return { stream, filesSize }
    }

    async runPipeline({ graphNotifier, progressNotifier }) {
        const result = await this.prepareStreams(this.#defaultInputFolder)
        return this.runProcess({
            ...result,
            graphNotifier,
            progressNotifier
        })
    }

    async runProcess({ stream, graphNotifier, progressNotifier, filesSize }) {

        return pipeline
            (
                stream,
                this.handleProgressBar(filesSize, progressNotifier),
                split(JSON.parse),
                this.mapFunction.bind(this),
                this.aggregate(graphNotifier),
                createWriteStream(this.#outputFinal),
            )
    }

    // 2
    handleProgressBar(filesSize, progressNotifier) {
        let processedAlready = 0;

        async function* progressBar(source) {
            for await (const data of source) {
                processedAlready += data.length
                progressNotifier.emit('update', { processedAlready, filesSize })
                yield data
            }
        }
        return progressBar.bind(this)
    }

    // 3
    async * mapFunction(source) {
        const likes = this.#likes


        for await (const data of source) {
            const tools = data.tools;
            // ignore people that chose two as prefered (deal as different persons)
            /*
                {
                    react: true,
                    vuejs: false,
                    angular: true,
                    ember: false
                }
            */
            const item = this.mergeListIntoObject(
                {

                    list: this.#tecnologiesInAnalysis,
                    mapper: tech => ({
                        [tech]: likes.includes(tools?.[tech]?.experience)
                    })
                }
            )


            const finalItem = {
                ...item,
                year: data.year
            }


            yield finalItem
        }
    };

    // 4
    aggregate(graphNotifier) {

        async function* feedGraph(source) {
            /*
                yearsInContext = {
                    '2018': {
                        react: 0,
                        ...
                    },
                    '2019': {
                        react: 0,
                        ...
                    },
                    total: will count all votes, only when called
                }
            */
            const yearsInContext = this.aggregateItemsPerYear(this.#years)
            /*
            for each date:
                {
                    react: true,
                    angular: true,
                    year: 2018                
                }
            */

            for await (const data of source) {
                const year = data.year.toString()
                Reflect.deleteProperty(data, 'year')

                // here it will count the votes
                // key = 'react'
                // year = 2017
                // data[key] = data['react'] = or false or true, = or 0 or 1
                // yearsInContext[2017][react] += 1 or 0
                Reflect.ownKeys(data).forEach(key => (yearsInContext[year][key] += data[key]))
            }

            // after calculate everything, says to update the graph
            /*
             yearsInContext = {
                 '2018': {
                     react: 2000,
                     ...
                 },
                 '2019': {
                     react: 4000,
                     ...
                 },
                 total: 6000 (will count all votes, only when called)
             }
             */
            graphNotifier.emit('update', yearsInContext)

            // pass this value ahead to save on file
            yield JSON.stringify(yearsInContext)
        }

        return feedGraph.bind(this)

    }

    aggregateItemsPerYear(years) {
        /*
        initialValues = {
            react: 0,
            angular: 0
            ...
        }
        */
        const initialValues = this.mergeListIntoObject(
            {
                list: this.#tecnologiesInAnalysis,
                mapper: item => ({ [item]: 0 })
            }
        )

        /*
        mapItemsPerYear = [
            [
                2019: {
                    react: 0,
                    angular: 0
                    ...
                },
            ],
            [
                2018: {
                    react: 0,
                    angular: 0
                    ...
                }
            ]
        ]
        */
        const mapItemsPerYear = year => ({
            [year]: {
                ...initialValues,

                get total() {
                    return Reflect.ownKeys(this)
                        .filter(key => key !== 'total')
                        .map(key => this[key])
                        .reduce((prev, next) => prev + next, 0);
                }
            }
        });

        /*
        {
            '2018': {...},
            '2019': {...},
            total: will count all votes, only when called
        }
        */
        return this.mergeListIntoObject({
            list: years,
            mapper: mapItemsPerYear
        })
    }

    mergeListIntoObject({ list, mapper }) {
        return list.map(mapper)
            .reduce((prev, next) => ({ ...prev, ...next }), {});
    }

    getFilesSize(files, folder) {
        return files
            .map(file => statSync(join(folder, file)).size)
            .reduce((prev, next) => prev + next, 0);
    }


    onLineChartUpdate(item) {

        Reflect.ownKeys(item)
            .forEach(year => {
                // indexYear = '2018'
                const indexYear = this.#years.indexOf(year.toString())

                /* 
                    item[year] = {
                        total: 1000,
                        react: 2000,
                        ...
                    }
                */
                const { total, ...yearContext } = item[year]
                /*
                    this.#lineChartData['react'].y['2017'] = yearContext['react'] ou 2000
                */

                Reflect.ownKeys(yearContext)
                    .forEach(lib => this.#lineChartData[lib].y[indexYear] = yearContext[lib])
            })

        return Object.values(this.#lineChartData)
    }
}