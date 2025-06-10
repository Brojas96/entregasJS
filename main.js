//============== SIMULADOR INTERACTIVO DE INVERSIONES ==============
//                      ENTREGA 1 - JAVASCRIPT

// Constantes para la validación de datos
const MIN_ANIOS = 1;
const MAX_ANIOS = 50;

/**
 * Función 1: ENTRADA DE DATOS
 * Pide al usuario los datos necesarios para la simulación mediante prompts.
 * Valida que los datos sean números válidos y estén en un rango aceptable.
 * @returns Un objeto con los datos de la inversión o null si el usuario cancela.
 */
function obtenerDatosDeInversion() {
    let capitalInicial = parseFloat(prompt("📈 Bienvenido al simulador de inversiones.\n\nPor favor, ingresa tu capital inicial:"));
    while (isNaN(capitalInicial) || capitalInicial < 0) {
        alert("Error: El capital inicial debe ser un número positivo.");
        capitalInicial = parseFloat(prompt("Por favor, ingresa tu capital inicial:"));
    }

    let aporteMensual = parseFloat(prompt("Ingresa el aporte mensual que realizarás:"));
    while (isNaN(aporteMensual) || aporteMensual < 0) {
        alert("Error: El aporte mensual debe ser un número positivo.");
        aporteMensual = parseFloat(prompt("Ingresa el aporte mensual que realizarás:"));
    }

    let plazoAnios = parseInt(prompt(`Ingresa el plazo de la inversión en años (entre ${MIN_ANIOS} y ${MAX_ANIOS}):`));
    while (isNaN(plazoAnios) || plazoAnios < MIN_ANIOS || plazoAnios > MAX_ANIOS) {
        alert(`Error: El plazo debe ser un número de años entre ${MIN_ANIOS} y ${MAX_ANIOS}.`);
        plazoAnios = parseInt(prompt(`Ingresa el plazo de la inversión en años (entre ${MIN_ANIOS} y ${MAX_ANIOS}):`));
    }

    let tasaAnual = parseFloat(prompt("Ingresa la tasa de interés anual esperada (ej: para 8.5% ingresa 8.5):"));
    while (isNaN(tasaAnual) || tasaAnual <= 0) {
        alert("Error: La tasa de interés debe ser un número positivo.");
        tasaAnual = parseFloat(prompt("Ingresa la tasa de interés anual esperada (ej: 8.5):"));
    }

    // Si el usuario presiona "cancelar" en algún punto, alguna variable puede ser NaN.
    // En un caso real, manejaríamos esto más elegantemente. Aquí, asumimos que si llega hasta el final, es válido.
    // Una simple comprobación final.
    if (isNaN(capitalInicial) || isNaN(aporteMensual) || isNaN(plazoAnios) || isNaN(tasaAnual)) {
        return null;
    }

    return {
        capital: capitalInicial,
        aporte: aporteMensual,
        plazo: plazoAnios,
        tasa: tasaAnual / 100 // Se convierte a decimal para los cálculos
    };
}

/**
 * Función 2: PROCESAMIENTO DE DATOS
 * Realiza el cálculo de la proyección de la inversión año por año.
 * @param {object} datos - Objeto con los datos de la inversión.
 * @returns Un array de objetos, donde cada objeto representa el estado de la inversión al final de un año.
 */
function calcularProyeccion(datos) {
    let proyeccionAnual = [];
    let balance = datos.capital;

    for (let anio = 1; anio <= datos.plazo; anio++) {
        // Se suman los aportes de todo el año
        balance += datos.aporte * 12;
        // Se calcula el interés ganado en el año
        const interesGanado = balance * datos.tasa;
        // Se suma el interés al balance (interés compuesto)
        balance += interesGanado;

        // Se guarda el resultado del año en el array
        proyeccionAnual.push({
            anio: anio,
            aportes: datos.aporte * 12 * anio,
            rendimiento: balance - datos.capital - (datos.aporte * 12 * anio),
            balanceFinal: balance
        });
    }
    return proyeccionAnual;
}


/**
 * Función 3: SALIDA DE DATOS
 * Muestra los resultados de la simulación al usuario en la consola y con un alert.
 * @param {array} proyeccion - El array con los resultados anuales.
 * @param {object} datosIniciales - Los datos originales para el resumen.
 */
function mostrarResultados(proyeccion, datosIniciales) {
    console.log("============== PROYECCIÓN DETALLADA DE LA INVERSIÓN ==============");
    console.log(`Capital Inicial: $${datosIniciales.capital.toFixed(2)}`);
    console.log(`Aporte Mensual: $${datosIniciales.aporte.toFixed(2)}`);
    console.log(`Plazo: ${datosIniciales.plazo} años`);
    console.log(`Tasa Anual: ${(datosIniciales.tasa * 100).toFixed(2)}%`);
    console.log("------------------------------------------------------------------");

    // console.table es ideal para mostrar arrays de objetos de forma ordenada
    console.table(proyeccion.map(item => ({
        'Año': item.anio,
        'Balance Final': `$${item.balanceFinal.toFixed(2)}`,
        'Aportes Totales': `$${item.aportes.toFixed(2)}`,
        'Rendimiento Total': `$${item.rendimiento.toFixed(2)}`
    })));

    // Se muestra un resumen final en un alert
    const resultadoFinal = proyeccion[proyeccion.length - 1];
    const mensajeFinal = `Después de ${datosIniciales.plazo} años, tu inversión tendría un balance final de:\n
💲 **$${resultadoFinal.balanceFinal.toFixed(2)}** 💲\n
Resumen:
- Capital Inicial: $${datosIniciales.capital.toFixed(2)}
- Total de Aportes: $${resultadoFinal.aportes.toFixed(2)}
- Rendimiento (Ganancia): $${resultadoFinal.rendimiento.toFixed(2)}`;

    alert(mensajeFinal);
}

/**
 * Función principal que orquesta la simulación.
 */
function iniciarSimulador() {
    let ejecutarOtraVez = false;

    do {
        // 1. Llamada a la función de ENTRADA
        const datosInversion = obtenerDatosDeInversion();

        if (datosInversion) {
            // 2. Llamada a la función de PROCESAMIENTO
            const proyeccion = calcularProyeccion(datosInversion);

            // 3. Llamada a la función de SALIDA
            mostrarResultados(proyeccion, datosInversion);
        } else {
            alert("Simulación cancelada por el usuario.");
        }

        // Se pregunta al usuario si desea realizar otra simulación
        ejecutarOtraVez = confirm("¿Deseas realizar otra simulación?");

    } while (ejecutarOtraVez);

    alert("Gracias por usar el simulador de inversiones. ¡Hasta pronto! 👋");
}

// =================================================================
//                      INICIO DEL PROGRAMA
// Se realiza la llamada a la función principal para que comience.
// =================================================================
iniciarSimulador();