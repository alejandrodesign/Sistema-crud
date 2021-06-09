"use strict";
 const IDBRequest = indexedDB.open("database",1)

 IDBRequest.addEventListener("upgradeneeded",()=>{
   const db = IDBRequest.result;
   db.createObjectStore("nombres",{
     autoIncrement: true
   });
 })

 IDBRequest.addEventListener("success",()=>{console.log("todo salio correctamente")})

 IDBRequest.addEventListener("error",()=>{console.log("error al abrir la base de datos")})


document.getElementById('add').addEventListener("click",()=>{
  let nombres = document.getElementById("nombre").value;
  if (nombres.length > 0) {
    addObjeto({nombres: nombre.value})
    nombre.value = "";
    leerObjetos()
  } else {
    addObjeto({nombre})
    leerObjetos()
  }
})

const addObjeto = objeto =>{
  const db = IDBRequest.result;
  const IDBtransaction = db.transaction("nombres","readwrite");
  const objectStore = IDBtransaction.objectStore("nombres");
  objectStore.add(objeto);
  IDBtransaction.addEventListener("complete",()=>{
    console.log("objecto agregado corectamente");
  })
}

const leerObjetos = ()=>{
  const db = IDBRequest.result;
  const IDBtransaction = db.transaction("nombres","readonly");
  const objectStore = IDBtransaction.objectStore("nombres");
  const cursor = objectStore.openCursor();
  const fragment = document.createDocumentFragment();
  document.querySelector(".nombres").innerHTML = ""
  cursor.addEventListener("success",()=>{
    if (cursor.result) {
      let elemento = nombresHTML(cursor.result.key,cursor.result.value);
      fragment.appendChild(elemento)
      cursor.result.continue()
    } else document.querySelector(".nombres").appendChild(fragment);
  })

}

const modificarObjeto = (key,objeto) => {
  const db = IDBRequest.result;
  const IDBtransaction = db.transaction("nombres","readwrite");
  const objectStore = IDBtransaction.objectStore("nombres");
  objectStore.put(objeto,key);
  IDBtransaction.addEventListener("complete",()=>{
    console.log("objeto modificado correctamente");
  })
}

const eliminarObjeto = key => {
  const IDBData = getIDBData("readwrite")
  IDBData.delete(key,"objecto eliminado correctamente");
}

const getIDBData = (mode,msg) =>{
  const db = IDBRequest.result;
  const IDBtransaction = db.transaction("nombres",mode);
  const objectStore = IDBtransaction.objectStore("nombres");
  IDBtransaction.addEventListener("complete",()=>{
    console.log(msg);
  })
  return objectStore;
}


const nombresHTML = (id,name) =>{
  const container = document.createElement("DIV");
  const h2 = document.createElement("h2");
  const option = document.createElement("DIV");
  const savebutton = document.createElement("button");
  const deletebutton = document.createElement("button");

  container.classList.add("nombre");
  option.classList.add("option");
  savebutton.classList.add("imposible");
  deletebutton.classList.add("delete");

  savebutton.textContent = "guardar"
  deletebutton.textContent= "eliminar"
  h2.textContent = name.nombres;
  h2.setAttribute("contenteditable","true")
  h2.setAttribute("spellcheck","false")
  h2.addEventListener("keyup",()=>{
    savebutton.classList.replace("imposible","posible")
  })

  savebutton.addEventListener("click",()=>{
    if (savebutton.className == "posible") {
      modificarObjeto(id,{nombre: h2.textContent})
      savebutton.classList.replace("posible", "imposible")

    }
  })

  deletebutton.addEventListener("click",()=>{
    eliminarObjeto(id);
    document.querySelector(".nombres").removeChild(container)
  })

  option.appendChild(savebutton);
  option.appendChild(deletebutton);

  container.appendChild(h2);
  container.appendChild(option)

  return container;
}
