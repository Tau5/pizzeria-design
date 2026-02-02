import {Row, Column} from "./base-components.js"

const checkboxTarjeta = <HTMLInputElement>document.getElementById("checkTarjeta")
const radioButtons = document.getElementsByClassName("check")
const expandTarjeta = document.getElementById("cardExpanded")
const via = (<HTMLInputElement>document.getElementById('via'));
const piso = (<HTMLInputElement>document.getElementById('piso'));
const ciudad = (<HTMLInputElement>document.getElementById('ciudad'));
const codPostal = (<HTMLInputElement>document.getElementById('codigoPostal'));

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
            impresAddressData()
            break;
        }
    }
}

function impresAddressData() {
    let container = document.getElementById('addressInformation');

    let pVia = document.createElement('p');
    pVia.innerHTML = via.value;
    let pPiso = document.createElement('p');
    pPiso.innerHTML = piso.value;
    let pCiudad = document.createElement('p');
    pCiudad.innerHTML = ciudad.value;
    let codiPostal = document.createElement('p');
    codiPostal.innerHTML = codPostal.value;

    container?.appendChild(pVia);
    container?.appendChild(pPiso);
    container?.appendChild(pCiudad);
    container?.appendChild(codiPostal);

}

init()