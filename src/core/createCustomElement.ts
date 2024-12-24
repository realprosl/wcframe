

type Property<T> = {key:string,value:T}
function newProperty<T>(key:string,value:T):Property<T>{
  return {key,value}
}

function pascalToKebab(name:string):string{
  return name.replace(/([a-z])([A-Z])/g ,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()
}

function isPath(str:string):boolean{
  return str.endsWith(".html") || str.endsWith(".htmx") 
}

function getProperties(obj:Object):Record<string,any>{
  const properties: Record<string,any> = {}
  Object.entries(obj).forEach(item => properties[item[0]] = item[1] )
  return properties
}

function evalWithContext(expresion:string,context:Record<string,any>){
  const keys = Object.keys(context)
  const values = Object.values(context)
  const func = new Function(...keys,`return ${expresion}`)
  return func(...values)
}

function compileTemplate(context:Record<string,any>, template:string):string{

  template = template.replace(/\{\{/g, '${').replace(/\}\}/g, '}')
  return evalWithContext("`"+ template + "`", context )
}

type propsCustomElement = {
  template:string
}


export function customElement(props:propsCustomElement){
  const f = function<T extends new(...args:any[])=> {}>(target:T){

    const current = new target

    const cls = class extends HTMLElement{

      constructor(){
        super()
        this.innerHTML = !isPath(props.template) ? compileTemplate(getProperties(current), props.template) : "file" 
      }

      // life clicle
      connectedCallback(){
        if ((target.prototype as Object).hasOwnProperty('onmount')) target.prototype.onmount()
      }
      disconnectedCalback(){
        console.log('remove')
      }
      adoptedCallback(){
        console.log('adopted')
      }

      // reactive attributes
      attributeChangedCallback(name:string, oldValue:string, newValue:string){}
      static get observedAttributes(){ return [] }

    }

    customElements.define(pascalToKebab(target.name),cls)
  }
  return f
}

