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

pedido: Array<PizzaInfo> = []

function ComposePizzaNode(pizza: PizzaInfo, onClick: () => void): HTMLDivElement {
   let root = document.createElement("div");

   root.classList = "inner-card column pizza-card row"

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
           () => { alert("Pizza vectorial") }
       )
   )
}