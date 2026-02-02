import {Row, Column} from "./base-components.js"

const checkboxTarjeta = <HTMLInputElement>document.getElementById("checkTarjeta")
const radioButtons = document.getElementsByClassName("check")
const expandTarjeta = document.getElementById("cardExpanded")
const desglosePedido = document.getElementById("desglosePedido")

class PizzaInfo {
    image: string = "";
    alergens: Array<string> = [];
    price: number = 0;
    name: string = "";


    constructor(image: string, alergens: Array<string>, price: number, name: string) {
        this.image = image;
        this.alergens = alergens;
        this.price = price;
        this.name = name;
    }
}

class Pedido {
    pizzas: Map<PizzaInfo, number>

    constructor(pizzas: Map<PizzaInfo, number>) {
        this.pizzas = pizzas;
    }

    getTotal(): number {
        let total = 0

        for (let [pizza, amount] of this.pizzas) {
           total += pizza.price * amount
        }

        return total
    }
}

let pedido = new Pedido(new Map())

let vistaActual = 0;

let pizzas = [
    new PizzaInfo(
        "https://upload.wikimedia.org/wikipedia/commons/4/45/Pizza_slice.png",
        [],
        12.0,
        "Pizza carbonara"
    ),
    new PizzaInfo(
        "https://upload.wikimedia.org/wikipedia/commons/4/45/Pizza_slice.png",
        [],
        8.0,
        "Pizza margarita"
    )
]

function ComposeDesglosePedido(pedido: Pedido) {
    let nodes: Array<HTMLElement> = []
    for (let [pizza, amount] of pedido.pizzas.entries()) {
        let label = document.createElement("p")
        label.innerText = pizza.name

        let amountLabel = document.createElement("p")
        amountLabel.innerText = `x ${amount}`

        let total = document.createElement("p")
        total.innerText = `${amount * pizza.price}€`
        total.classList.add("flex-item-right")

        nodes.push(
            Row([label, amountLabel, total])
        )
    }

    let labelTotal = document.createElement("p")
    labelTotal.innerText = "Total"


    let labelTotalAmount = document.createElement("p")
    labelTotalAmount.innerText = `${pedido.getTotal()}€`
    labelTotalAmount.classList.add("flex-item-right")

    nodes.push(
        Row([labelTotal, labelTotalAmount])
    )

    return nodes
}

function init() {
    nextView()

    let elegir_pizza_node = document.getElementById("menu-pizzas")
    for (let p of pizzas) {
        elegir_pizza_node?.appendChild(
            ComposePizzaNode(p, () => addOnePizza(p))
        )
    }

    for (let check of radioButtons) {
        console.log(check.outerHTML)
        check.addEventListener("input", (ev) => { onUpdateCheckTarjeta() })
    }

    onUpdateCheckTarjeta()
}

function onUpdateCheckTarjeta() {
    console.log(checkboxTarjeta.checked)
    if (checkboxTarjeta?.checked) {
        expandTarjeta?.classList.remove("hidden")
    } else {
        expandTarjeta?.classList.add("hidden")
    }
}

function addOnePizza(pizza: PizzaInfo) {
    let maybe_pizza = pedido.pizzas.get(pizza)
    if (maybe_pizza != undefined) {
        pedido.pizzas.set(pizza, maybe_pizza + 1)
    } else {
        pedido.pizzas.set(pizza, 1)
    }

    updatePedido()
}

// Refrescar la lista de pizzas en el pedido
function updatePedido() {
    let pedidosNode = document.getElementById("pedidos")
    if (pedidosNode != null) {
        pedidosNode.innerHTML = ""

        for (let [p, i] of pedido.pizzas) {
            if (i < 1) continue
            pedidosNode.appendChild(
                ComposeOrderNode(p, i, () => {
                    let maybe_pizza = pedido.pizzas.get(p)
                    if (maybe_pizza != null) {
                        pedido.pizzas.set(p, maybe_pizza - 1)
                        updatePedido()
                    }
                },
                (newValue) => {
                    pedido.pizzas.set(p, newValue)
                    updatePedido()
                })
            )
        }
    }


}

function ComposePizzaNode(pizza: PizzaInfo, onClick: () => void): HTMLDivElement {
    let root = document.createElement("div");

    root.classList = "inner-card pizza-card row"

    let pizzaImage = document.createElement("img")
    pizzaImage.src = pizza.image.toString()

    root.appendChild(pizzaImage)

    let column = document.createElement("div")
    column.classList = "column"

    let name = document.createElement("p")
    name.innerText = pizza.name
    column.appendChild(name)

    let alergensRow = document.createElement("div")
    alergensRow.classList = "row"

    for (let alergen of pizza.alergens) {
        let alergenNode = document.createElement("img")
        alergenNode.src = alergen.toString()
        alergensRow.appendChild(alergenNode)
    }

    column.appendChild(alergensRow)

    let button = document.createElement("button");
    button.classList = "button-primary"
    button.innerText = "Añadir al pedido"
    button.addEventListener("click", () => onClick())

    column.appendChild(button)
    root.appendChild(column)

    return root
}

function ComposeOrderNode(pizza: PizzaInfo,
                          amount: number,
                          onClick: () => void,
                          onValueChange: (value: number) => void): HTMLDivElement {

   let root = document.createElement('div');
   root.classList = 'inner-card pizza-card';

   let pizzaImage = document.createElement("img")
   pizzaImage.src = pizza.image.toString()
   root.appendChild(pizzaImage)

   let column = document.createElement("div")
   column.classList = "column"

   let name = document.createElement('h3');
   name.innerHTML = pizza.name;

   let count = document.createElement('input');
   count.value = amount.toString();

   count.oninput = () => {
       let maybeNewValue = parseInt(count.value);
       if (!isNaN(maybeNewValue)) {
           onValueChange(maybeNewValue);
       }
   }

   count.type = 'number';

   let price = document.createElement('p');
   price.innerHTML = `x ${pizza.price} €`;
   price.classList.add("flex-item-right")

   let button = document.createElement('button');
   button.classList = 'button';
   button.innerHTML = 'Quitar 1';
   button.addEventListener('click', () => onClick());

   let totalPrice = document.createElement('p');
   totalPrice.innerHTML = `${(count.valueAsNumber * pizza.price)}€`;

   let inner =
       Row([pizzaImage, Column(
       [
           name,
           Row([button, count, price]),
           totalPrice
       ]
   )])

    inner.classList.add("inner-card", "pizza-card")
    return inner
}

function test_newNodoPizza() {
    let elegir_pizza_node = document.getElementById("menu-pizzas")
    elegir_pizza_node?.appendChild(
        ComposePizzaNode(
            new PizzaInfo(
                "https://upload.wikimedia.org/wikipedia/commons/4/45/Pizza_slice.png",
                [],
                12.0,
                "Pizza vectorial"
            ),
            () => {
                alert("Pizza vectorial")
            }
        )
    )
}

function createNodesTracking() {
    for (let n of ComposeDesglosePedido(pedido)) {
        desglosePedido?.appendChild(n)
    }
}

export function nextView(): void {
    let vistas: Array<string> = ['elegir-pizzas', 'menu-direccion', 'menu-pagar', 'menu-trackeo'];

    vistas.forEach(idActual => {
       let vista = document.getElementById(idActual);
       vista?.classList.add('hidden');
    });

    document.getElementById(vistas[vistaActual])?.classList.remove("hidden")
    vistaActual++;

    switch (vistaActual) {
        case 0: {
            break;
        }
        case 1: {
            break;
        }
        case 2: {
            break;
        }
        case 3: {
            createNodesTracking()
            break;
        }
    }
}

init()