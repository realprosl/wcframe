
import {customElement} from "../core/createCustomElement"


@customElement({
  template:`<span>{{count}}</span><button>{{mierda.toUpperCase()}}</button>`
})
export class AppSample{
  count = 0
  mierda = "Paco"

  onmount(){
    console.log("se monta elemento")
  }
}
