require('dotenv').config()


const { leerInput, pausa, inquirerMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() =>{

    const busquedas = new Busquedas();
    let opt = 0;


    do {
        opt = await inquirerMenu(); 

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                //Buscar el lugar 
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);

                if(id === '0' )continue;

                const lugarSel = lugares.find(l => l.id === id)

                //Guardar en DB 
                busquedas.agregarHistorial(lugarSel.nombre);

                //Clima 
                const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);

                //Mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat: ', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Min: ', clima.min);
                console.log('Max: ', clima.max);
                console.log('Como está el clima:', clima.desc.green )
            break;

            case 2:
                busquedas.historialCapitaizado.forEach((lugar, i) =>{
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`)
                })
            break;
                
            case 0:
                console.log('Ustede esta en la opcion 0')
            break;
        
            default:
                break;
        }
        
        if(opt !== 0) await pausa();
    } while (opt !== 0 );


}

main();