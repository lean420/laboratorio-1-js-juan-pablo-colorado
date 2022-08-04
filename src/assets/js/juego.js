const juego = (() => {
  // **
  //  * 2C = 2 de trebol (clubs)
  //  * 2D = 2 de diamante (diamont)
  //  * 2H = 2 de corazones (heart)
  //  * 2S = 2 de picas (spades)

  let baraja = []
  const tipos = ['C', 'D', 'H', 'S']
  const letras = ['J', 'Q', 'K', 'A']

  //let puntosjugador = 0
  //let puntosComputadora = 0
  let puntosjugadores = [] // El ultimo jugador siempre es la pc

  //referencias al html
  const btnPedir = document.querySelector('#btn-pedir'),
    btnDetener = document.querySelector('#btn-detener'),
    btnNuevo = document.querySelector('#btn-nuevo'),
    puntosHTML = document.querySelectorAll('small'),
    divCartasjugadores = document.querySelectorAll('.divCartas')

  const inicializarJuego = (numjugadores = 2) => {
    console.clear()
    baraja = crearBaraja()
    puntosjugadores = []

    for (let i = 0; i < numjugadores; i++) {
      puntosjugadores.push(0)
    }

    puntosHTML.forEach((elem) => (elem.innerText = 0))
    divCartasjugadores.forEach((elem) => (elem.innerHTML = ''))

    btnPedir.disabled = false
    btnDetener.disabled = true
  }

  crearBaraja = () => {
    // se puebla el arreglo con los numeros y tipos de la baraja
    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        baraja.push(i + tipo)
      }
    }
    // se puebla el arreglo con letras y tipos de la baraja
    for (let letra of letras) {
      for (let tipo of tipos) {
        baraja.push(letra + tipo)
      }
    }

    return _.shuffle(baraja)
  }

  const pedirCarta = () => {
    btnDetener.disabled = false
    const barajaTamanio = baraja.length
    if (barajaTamanio === 0) throw 'No hay cartas en la baraja'

    return baraja.splice(Math.floor(Math.random() * barajaTamanio), 1)[0]
  }

  const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1)
    return isNaN(valor) ? (valor === 'A' ? 11 : 10) : Number(valor)
  }

  const acumularPuntos = (carta, turno) => {
    puntosjugadores[turno] += valorCarta(carta)
    puntosHTML[turno].innerText = puntosjugadores[turno]
    return puntosjugadores[turno]
  }

  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement('img')
    imgCarta.classList.add('carta')
    imgCarta.src = `assets/cartas/${carta}.png`
    divCartasjugadores[turno].append(imgCarta)
  }

  const determinarGanador = () => {
    const [puntosMinimos, puntosComputadora] = puntosjugadores

    setTimeout(() => {
      if (puntosMinimos === puntosComputadora) alert('Hubo empate')
      else if (puntosMinimos > 21) alert('Computadora gana')
      else if (puntosComputadora > 21) alert('Genial, ganaste')
      else alert('Computadora gana')
    }, 100)
  }

  const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0
    do {
      const carta = pedirCarta()
      const turnoComputadora = puntosjugadores.length - 1

      puntosComputadora = acumularPuntos(carta, turnoComputadora)
      crearCarta(carta, turnoComputadora)

      if (puntosMinimos > 21) break
    } while (puntosComputadora <= puntosMinimos && puntosMinimos <= 21)

    determinarGanador()
  }

  //eventos
  btnPedir.addEventListener('click', () => {
    btnDetener.disabled = false
    const carta = pedirCarta()
    const puntosjugador = acumularPuntos(carta, 0)
    crearCarta(carta, 0)

    if (puntosjugador > 21) {
      btnPedir.disabled = true
      btnDetener.disabled = true
      console.warn('lo siento, ya perdiste')
      turnoComputadora(puntosjugador)
    } else if (puntosjugador === 21) {
      btnPedir.disabled = true
      btnDetener.disabled = true
      console.warn('21, Genial')
      turnoComputadora(puntosjugador)
    }
  })

  btnDetener.addEventListener('click', () => {
    btnPedir.disabled = true
    btnDetener.disabled = true
    turnoComputadora(puntosjugadores[0])
  })

  btnNuevo.addEventListener('click', () => {
    inicializarJuego()
    console.clear()
  })
  return { nuevoJuego: inicializarJuego }
})()
