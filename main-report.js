// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDl4eXuYyheuuemntHWv0WfSAM2v9jMWJg",
    authDomain: "co19-arg.firebaseapp.com",
    projectId: "co19-arg",
});

var db = firebase.firestore();
//-- GUARDO DATOS EN MI COLECCION DE FIRESTORE--------------------------
function guardar() {
    //Inicializo variables dentro del scope de mi funcion

    let nombre = document.getElementById('name').value;
    let sex = document.getElementById('sex').value;
    let years = document.getElementById('years').value;
    let months = document.getElementById('months').value;
    let description = document.getElementById('description').value;
    let mail = document.getElementById('mail').value;
    let state = document.getElementById('state').value;
    let specie = document.getElementById('specie').value;
    // .add --> es propio de firestore --> Agrega un id a nuestra coleccion --> Inicializo los atributos de mi coleccion.
    db.collection("reports").add({
        name: nombre,
        sex: sex,
        years: years,
        months: months,
        description: description,
        mail: mail,
        state: state,
        species: specie
    })//Limpieza de los campos despues de un input de datos -- El docRef es el id de elemento que se agrego.. se usa como referencia de debugging
        .then(function () { 
            $('#formReport').trigger('reset'); //Solucionar redundancia con un reset(); //Teniendo en cuenta al objeto db
            // $('#formReport').modal('hide');
        })//Capturo el eventual error
        .catch(function (error) {
            //Captura del error
            console.error("Error adding document: ", error);
        });
}

//-- VISUALIZACION DE DATOS EN TABLA --------------------------
const tableReports = document.getElementById('viewReports');
    db.collection("reports").onSnapshot((querySnapshot) => { //onSnapshot se queda escuchando ante cualquier cambio....
    tableReports.innerHTML = ''; //Se utiliza para que cuando se graben los datos, no se inserten los datos existentes antes del nuevo insert
    querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`); //Para testing
        //Con += concateno un tr por cada iteracion
        tableReports.innerHTML += `
        <tr>
            <td>${doc.data().name}</td>
            <td>${doc.data().sex}</td>
            <td>${doc.data().years}</td>
            <td>${doc.data().months}</td>
            <td>${doc.data().description}</td>
            <td>${doc.data().mail}</td>
            <td>${doc.data().state}</td>
            <td>${doc.data().species}</td>
            <td>
             <button class="btn btn-primary" onclick="adoptar('${doc.id}')">Adoptar</button>
            </td>
            <td>
                <button class = "btn btn-warning" data-toggle="modal" data-target="#exampleModal"
                data-whatever="@mdo" onclick="modificar('${doc.id}','${doc.data().name}', '${doc.data().sex}', 
                    '${doc.data().years}', '${doc.data().months}', '${doc.data().description}', '${doc.data().mail}', 
                    '${doc.data().state}','${doc.data().species}')">Modificar</button>
            </td> 
        </tr>
        `
    });
});

//-- Modificar Datos de Firestore --------------------------
function modificar(id, nombre, sexo, anios, meses, descripcion, mail, estado, especie) { //Recibo parametros de la funcion modificar

    document.getElementById('name').value = nombre;//Orden: El primer name es el id del input y el segundo es lo que recibe por referenia
    document.getElementById('sex').value = sexo;
    document.getElementById('years').value = anios;
    document.getElementById('months').value = meses;
    document.getElementById('description').value = descripcion;
    document.getElementById('mail').value = mail;
    document.getElementById('state').value = estado;
    document.getElementById('specie').value = especie;
    // $('#formReport').trigger('reset');
    //Creo un button con estilos distintos al de "Guardar"
    let botonModificar = document.getElementById('button');
    botonModificar.innerHTML = 'Modificar'; //Nombre del boton al momento de confirmar los cambios

    if(botonModificar.onclick != true ){

    botonModificar.onclick = function () {
        let reportsRef = db.collection("reports").doc(id); //modificar washington
        let nombre = document.getElementById('name').value;
        let sexo = document.getElementById('sex').value;
        let anios = document.getElementById('years').value;
        let meses = document.getElementById('years').value;
        let descripcion = document.getElementById('description').value;
        let mail = document.getElementById('mail').value;
        let estado = document.getElementById('state').value;
        let especie = document.getElementById('specie').value;
        // $('#exampleModal').trigger('reset');
        return reportsRef.update({
            name: nombre, //Objeto referente a la coleccion de Firestore = Variable referente dentro de JS
            sex: sexo,
            years: anios,
            months: meses,
            description: descripcion,
            mail: mail,
            state: estado,
            species: especie
        })
            .then(function () {
                // console.log("Document successfully updated!");
                //Dejo el boton 'Guardar' para que despues de modificar los datos, vuelva a dejar placeholder por default
                botonModificar.innerHTML = 'Guardar';
                botonModificar.onclick=function(){
                    guardar();
                }
                //Limpio los datos del formulario
                // $('formReport').reset();
                $('#formReport').trigger('reset');
            })
            .catch(function (error) {
                console.error("Error updating document: ", error);
            });
    }

    }else{
        $('#formReport').trigger('reset');

    }

}
//-- Eliminar Datos de Firestore --------------------------
function adoptar(id) {
    Swal.fire({
        title: '¿Seguro de que desea continuar?',
        showCancelButton: true,
        confirmButtonColor: '#008f4c',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡¡Mascota Adoptada!!'
    }).then((result) => {
        if (result.isConfirmed) {//result.isConfirmed
            db.collection("reports").doc(id).delete().then(function () {
                
            });
        }
    })
}

//Agregar este boton al formulario
    // const iconEdit = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    // <td><button class="btnEditar btn btn-warning" data-toggle="tooltip" title="Edit">${iconEdit}</button> //Pegar dentro de querySnapshot
