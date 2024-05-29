import { Actor, CollisionType, Color, Engine, Font, FontUnit, Label, Loader, Sound, vec } from "excalibur"

// 1 - Criar uma instancia de Engine, que representa o jogo
const game = new Engine({
	width: 800,
	height: 600
})

const ping = new Sound('./src/plim.mp3');
const lose = new Sound('./src/roblox-death-sound-effect.mp3');
const plim = new Sound('./src/rojao.wav')

const pong = new Loader([ping, lose, plim]);


// 2 - Criar barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,
	width: 200,
	height: 20,
	color: Color.Chartreuse
})

// Define o tipo de colisão da barra
// CollisionType.Fixed = significa que ele não irá se "mexer" quando colidir
barra.body.collisionType = CollisionType.Fixed

// Insere o Actor barra - player, no game
game.add(barra)

// 3 - Movimentar a de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	// Faz a posição x da barra, ser igual a posição x do mouse
	barra.pos.x = event.worldPos.x
})

// 4 - Criar Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

// let coresBolinha = [
// 	Color.Black,
// 	Color.Green,
// 	Color.Yellow,
// 	Color.Red,
// 	Color.Magenta,
// 	Color.Violet,
// 	Color.Blue,
// 	Color.White,
// 	Color.Rose
// ]

// let numeroCores = coresBolinha.length

// 5 - Criar movimentação da bolinha
const velocidadeBolinha = vec(1000, 1000)

// Após 1 segundo (1000ms), define a velocidade da bolinha em x = 100 e y = 100
setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

// 6 - Fazer bolinha rebater na parede
bolinha.on("postupdate", () => {
	// Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}

	// Se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x
	}

	// Se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}

	// Se a bolinha colidir com a parte inferior
	// if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	// 	bolinha.vel.y = -velocidadeBolinha.y
	// }
})

// Insere bolinha no game
game.add(bolinha)

// 7 - Criar os blocos
// Configurações de tamanho e espeçamento dos blocos
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Vermilion, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
// const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

// Renderiza 3 linhas
for (let j = 0; j < linhas; j++) {
	
	// Renderização dos 5 bloquinhos
	for (let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})
		)
	}
}

listaBlocos.forEach(bloco => {
	// Define o tipo de colisor de cada bloco
	bloco.body.collisionType = CollisionType.Active

	// Adiciona cada bloco no game
	game.add(bloco)
})

// Adicionando pontuação
let pontos = 0

const textoPontos = new Label({
	text: pontos.toString(),
	font: new Font({
		size: 40,
		color: Color.White,
		strokeColor: Color.Black,
		unit: FontUnit.Px
	}),
	pos: vec(600, 500)
})

game.add(textoPontos)

// const textoPontos = new Text({
// 	text: "Hello World",
// 	font: new Font({ size: 30 })
// })

// const objetoTexto = new Actor({
// 	x: game.drawWidth - 80,
// 	y: game.drawHeight - 15
// })

// objetoTexto.graphics.use(textoPontos)

// game.add(objetoTexto)

let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {
	// Verificar se a bolinha colidiu com algum bloco destrutivel
	console.log("Colidiu com", event.other.name);
	
	
	// Se o elemento colidido for um bloco da lista de blocos (destrutiveis)
	if (listaBlocos.includes(event.other)) {
		// Destruir o bloco colidido
		event.other.kill()
		ping.play(0.5);

		// Adiciona um ponto
		pontos++

		// Mudar a cor da bolinha
		// bolinha.color = coresBolinha[ Math.trunc(Math.random() * numeroCores)]
		bolinha.color = event.other.color

		// Atualiza valor do placar - textoPontos
		textoPontos.text = pontos.toString()

		if (pontos == 15) {
			plim.play(0.2)
			alert('Você ganhou!!!')
			window.location.reload()
		}
	}

	// Rebater a bolinha = Inverter as direções
	let interseccao = event.contact.mtv.normalize()

	// Se não está colidindo
	// !colidindo -> colidindo == false
	if (!colidindo) {
		colidindo = true

		// interseccao.x e interseccao.y
		// O maior representa o eixo onde houve o contato
		if (Math.abs(interseccao.x) > Math.abs(interseccao.y)) {
			// bolinha.vel.x = -bolinha.vel.x
			// bolinha.vel.x *= -1
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			// bolinha.vel.y = -bolinha.vel.y
			// bolinha.vel.y *= -1
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}
})

bolinha.on("collisionend", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {
	lose.play(1)
	alert("E morreu")
	window.location.reload()
})

// Inicia o game
await game.start(pong)