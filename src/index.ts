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

class ItemPizza {
   pizza: PizzaInfo;
   cantidad: number;

   constructor(pizza: PizzaInfo, cantidad: number) {
      this.pizza = pizza;
      this.cantidad = cantidad;
   }
}

class Pedido {
   pizzas: Set<ItemPizza>

   constructor(pizzas: Set<ItemPizza>) {
      this.pizzas = pizzas;
   }


}

let pedido: Array<ItemPizza> = []

function ComposePizzaNode(pizza: PizzaInfo, onClick: () => void): HTMLDivElement {
   let root = document.createElement("div");

   root.classList = "inner-card column pizza-card row"

   let pizzaImage = document.createElement("img")
   pizzaImage.src = pizza.image.toString()

   root.appendChild(pizzaImage)

   let column = document.createElement("div")
   column.classList = "column"

   let name = document.createElement("h2")
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

function ComposeOrderNode(pizza: PizzaInfo, onClick: () => void): HTMLDivElement {

   let root = document.createElement('div');
   root.classList = 'inner-card card';

   let pizzaImage = document.createElement("img")
   pizzaImage.src = pizza.image.toString()

   root.appendChild(pizzaImage)

   let column = document.createElement("div")
   column.classList = "column"

   let name = document.createElement('h3');
   name.innerHTML = pizza.name;
   column.appendChild(name);

   let count = document.createElement('input');
   count.type = 'number';
   column.appendChild(count)

   let price = document.createElement('p');
   price.innerHTML = pizza.price.toString();
   column.appendChild(price);

   let button = document.createElement('button');
   button.classList = 'button';
   button.innerHTML = 'Quitar 1';
   button.addEventListener('click', () => onClick());
   column.appendChild(button);

   let totalPrice = document.createElement('p');
   totalPrice.innerHTML = (count.valueAsNumber * pizza.price).toString();
   column.appendChild(totalPrice);

   root.appendChild(column);

   return root
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
           () => { alert("Pizza vectorial"),
           ComposeOrderNode(
               new PizzaInfo(
                   "https://upload.wikimedia.org/wikipedia/commons/4/45/Pizza_slice.png",
                   [],
                   12.0,
                   "Pizza vectorial"
               ),
               () => {
                  alert('Si')
               }
           )}
       )
   )
}