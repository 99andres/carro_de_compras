let contenedorProductos=document.getElementById("contenedorProductos")
let tbodyProductos=document.getElementById('tbodyProductos')


let tfoot=document.getElementById("tfoot")
let carrito={}

//template
let templateProducto=document.getElementById("templateProducto").content
let templateBody=document.getElementById("templateBody").content
let templateFooter=document.getElementById("templateFooter").content

//fragment
let fragment=document.createDocumentFragment()
//eventos
document.addEventListener('DOMContentLoaded',()=>{

    peticionAsincronica()
    if(localStorage.getItem('carrito')){
        carrito=JSON.parse(localStorage.getItem('carrito'))
        tableBody();        
    }
    
})
contenedorProductos.addEventListener("click",function(e){
    filtrarBotonProductos(e)
})
//funciones
function getData(){
    return new Promise((resolve,reject)=>{
        fetch('json.js')
        .then(data=>data.json())
        .then((resultado)=>{
            return resolve(resultado)
        })
    })
}
async function peticionAsincronica(){
    
    let promesa=await getData()
    let resultado=await Promise.all(promesa)
    getProductos(resultado)
    
}
let getProductos=function(resultado){
    resultado.forEach(element => {
        
        templateProducto.querySelector('h5').textContent=element.title
        templateProducto.querySelector('p').textContent=element.precio
        templateProducto.querySelector('.btnComprar').dataset.id=element.id
        templateProducto.querySelector('img').src=element.url
        let clone=templateProducto.cloneNode(true)
        fragment.appendChild(clone)
    });
    contenedorProductos.appendChild(fragment)
    
    
}

let filtrarBotonProductos=function(e){
    if(e.target.classList.contains('btnComprar')){
        objetoCarro(e.target.parentElement)    
    }
    e.stopPropagation()
}
let objetoCarro=function(contenedorDatosParametro){
    
    let objetoProducto={
        id:contenedorDatosParametro.querySelector('button').dataset.id,
        precio:contenedorDatosParametro.querySelector('p').textContent,
        title:contenedorDatosParametro.querySelector('h5').textContent,
        cantidad:1
    }
    if(carrito.hasOwnProperty(objetoProducto.id)){
        //objetoProducto.cantidad la primera vez vale una segunda vez qtiene que ser el valor de carrito para sumar y asignarse lo otravez al carrito
        objetoProducto.cantidad=carrito[objetoProducto.id].cantidad+=1//esta linea solo funciona de esta form
           

    }
    carrito[objetoProducto.id]={...objetoProducto}

    tableBody()

}
let tableBody=function () {
    tbodyProductos.innerHTML=""
    //console.log(typeof carrito)//es de tipo object literal
    //console.log(typeof [1,2,34,3]) //es de tipo object de array
    Object.values(carrito).forEach(element=>{
        templateBody.querySelector('th').textContent=element.id
        templateBody.querySelectorAll('td')[0].textContent=element.title
        templateBody.querySelectorAll('td')[1].textContent=element.cantidad
        templateBody.querySelectorAll('td')[3].textContent=element.cantidad*element.precio
        templateBody.querySelectorAll('button')[0].dataset.id=element.id    
        templateBody.querySelectorAll('button')[1].dataset.id=element.id
        let clone=templateBody.cloneNode(true)
        fragment.appendChild(clone)
    })
    tbodyProductos.appendChild(fragment)
    tableFoot()
    localStorage.setItem('carrito',JSON.stringify(carrito))


}

let tableFoot=function(){
    tfoot.innerHTML=""
    
    if(Object.keys(carrito).length===0){
        tfoot.innerHTML='<th colspan="5">comprar-carrito vacio</th>'  
        
        //al colocar un return el codigo se corta
        return 

    }
    
    let tvalor=Object.values(carrito).reduce((acc,{cantidad,precio})=>acc+cantidad*precio,0)
    let tTotal=Object.values(carrito).reduce((acc,{cantidad})=>acc+cantidad,0)
    templateFooter.querySelectorAll('th')[1].textContent=tTotal
    templateFooter.querySelector('span').textContent=tvalor
    let clone=templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    tfoot.appendChild(fragment)
    //
    let btnVaciar=document.getElementById('btnVaciar')
    
    //la línea de arriba se coloca en esta parte ya que el boton 
    //existe cundo se coloca en el tabla    
    btnVaciar.addEventListener('click',vaciandoCarro)
    tbodyProductos.addEventListener("click",validandoAccion)
    

    
    
}
function vaciandoCarro(){
    carrito={}
    tableBody()
}
function validandoAccion(e){
    
    if(e.target.classList.contains('mas')){
        carrito[e.target.dataset.id].cantidad++
        tableBody()
        
    }
    
    else if(e.target.classList.contains('menos')){
        
        carrito[e.target.dataset.id].cantidad--
        
        if(carrito[e.target.dataset.id].cantidad==0){
            delete carrito[e.target.dataset.id] 
        }
        tableBody()
        
            
    }
}
























