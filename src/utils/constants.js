import * as path from 'path'

export const baseURL = 'https://codigo-postal.co'

export const dataPaths = {
    localities: path.join(path.resolve(), '/src/data/localidades.csv'),
    streets: path.join(path.resolve(), '/src/data/calles.csv'),
    height: path.join(path.resolve(), '/src/data/altura.csv'),
}

export const provinces = {
    ciudad_autonoma_de_buenos_aires: {
        name: 'Ciudad Autonoma de Buenos Aires',
        stateCode: 'C',
        endpoint:
            '/argentina/capital-federal/calles-de-ciudad-autonoma-buenos-aires',
    },
    buenos_aires: {
        name: 'Buenos Aires',
        stateCode: 'B',
        endpoint: '/argentina/buenos-aires',
    },
    catamarca: {
        name: 'Catamarca',
        stateCode: 'K',
        endpoint: '/argentina/catamarca',
    },
    chaco: {
        name: 'Chaco',
        stateCode: 'H',
        endpoint: '/argentina/chaco',
    },
    chubut: {
        name: 'Chubut',
        stateCode: 'U',
        endpoint: '/argentina/chubut',
    },
    cordoba: {
        name: 'Cordoba',
        stateCode: 'X',
        endpoint: '/argentina/cordoba',
    },
    corrientes: {
        name: 'Corrientes',
        stateCode: 'W',
        endpoint: '/argentina/corrientes',
    },
    entre_rios: {
        name: 'Entre Rios',
        stateCode: 'E',
        endpoint: '/argentina/entre-rios',
    },
    formosa: {
        name: 'Formosa',
        stateCode: 'P',
        endpoint: '/argentina/formosa',
    },
    jujuy: {
        name: 'Jujuy',
        stateCode: 'Y',
        endpoint: '/argentina/jujuy',
    },
    la_pampa: {
        name: 'La Pampa',
        stateCode: 'L',
        endpoint: '/argentina/la-pampa',
    },
    la_rioja: {
        name: 'La Rioja',
        stateCode: 'F',
        endpoint: '/argentina/la-rioja',
    },
    mendoza: {
        name: 'Mendoza',
        stateCode: 'M',
        endpoint: '/argentina/mendoza',
    },
    misiones: {
        name: 'Misiones',
        stateCode: 'N',
        endpoint: '/argentina/misiones',
    },
    neuquen: {
        name: 'Neuquen',
        stateCode: 'Q',
        endpoint: '/argentina/neuquen',
    },
    rio_negro: {
        name: 'Rio Negro',
        stateCode: 'R',
        endpoint: '/argentina/rio-negro',
    },
    salta: {
        name: 'Salta',
        stateCode: 'A',
        endpoint: '/argentina/salta',
    },
    san_juan: {
        name: 'San Juan',
        stateCode: 'J',
        endpoint: '/argentina/san-juan',
    },
    san_luis: {
        name: 'San Luis',
        stateCode: 'D',
        endpoint: '/argentina/san-luis',
    },
    santa_cruz: {
        name: 'Santa Cruz',
        stateCode: 'Z',
        endpoint: '/argentina/santa-cruz',
    },
    santa_fe: {
        name: 'Santa Fe',
        stateCode: 'S',
        endpoint: '/argentina/santa-fe',
    },
    santiago_del_estero: {
        name: 'Santiago del Estero',
        stateCode: 'G',
        endpoint: '/argentina/santiago-del-estero',
    },
    tierra_del_fuego: {
        name: 'Tierra del Fuego',
        stateCode: 'V',
        endpoint: '/argentina/tierra-del-fuego',
    },
    tucuman: {
        name: 'Tucuman',
        stateCode: 'T',
        endpoint: '/argentina/tucuman',
    },
}
