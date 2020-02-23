function listarCategorias(){ // se declara la funcion 
	ruta = "http://localhost/api/categoria/listar"; // url para hacer la petecion 
	$.get(ruta,function(result){ // servicio get para traer la data 
		combo = $("#inputCategoria");
		for(i=0;i<result.length;i++){ // iteracion del resultado 
			dato = result[i];
			console.log(dato); // impresion por consola de los dataos optenidos de la petision 
			opcion = '<option value="'+dato.id+'">'+dato.nombre+'</option>'; // iteracion del resultado en la vista html
			combo.append(opcion); // asignacion del objteo opncion  al objeto  combo
		}
	},'json');
}
function listarProductos(){ // se declra la funcion listar productos 
	ruta = "http://localhost/api/producto/listar"; // url a la que solicitara la data 
	tabla = $("#datos");//Obtengo la tabla
	tabla.html("");
	$.get(ruta,function(result){ // peticion get a la url para traer la data 
		for(i=0;i<result.length;i++){ // iteracion del resultado 
			//Creo la fila
			fila = '<tr>'+  // Sec cre la tabla con la data yla iteracion 
				   '<td>'+result[i].nombre+'</td>'+
				   '<td>S/ '+result[i].precio+'</td>'+
				   '<td>'+result[i].stock+'</td>'+
				   '<td><button data-id="'+result[i].id+'" class="btn btn-info btnEditar"><i class="fas fa-edit"></i></button> '+
				   '<button data-id="'+result[i].id+'" class="btn btn-danger btnEliminar"><i class="fas fa-trash-alt"></i></button></td>'+
				   '</tr>';
			tabla.append(fila); //Añado la fila a la tabla
			console.log(result[i].nombre);
			console.log(result[i].precio);
		}
	},'json');
}
$(document).ready(function(){

	// Esta funcion es para enviar datos al serve porque es por el metodo post o put

	listarCategorias(); // se llama la funcion listar categoria 
	listarProductos(); // se llama la funcion listar productos 
	$(".btnGuardar").click(function(){
		val_id = $("#inputId").val(); // se captura el valor del input 
		if(val_id==""){ // Nuevo producto
			metodo = "POST";
			ruta = 'http://localhost/api/producto/nuevo';
		}else{ // Ya existe un id
			metodo = "PUT";
			ruta = 'http://localhost/api/producto/editar/'+val_id;
		}
		datos = { 
			// Se pasa los valores del los input del formulario 
			"categoria_id": $("#inputCategoria").val(),
			"nombre" : $("#inputNombre").val(),
			"precio" : $("#inputPrecio").val(),
			"stock" : $("#inputStock").val(),
			"imagen" : $("#inputImagen").val(),
			"estado" : $("#inputEstado").val()
		}
		$.ajax({ // se hace la petision via ajax se envian los datos al servidor 
			url: ruta, // url 
			type: metodo, // post o put
			data: JSON.stringify(datos), // datos a enviar
			success: function(result){
				listarProductos(); // se cacha la respuesta sie es correcta hace  esto
				$("#exampleModal").modal('hide');
			}
		});
	});
	$("#datos").on('click','.btnEditar',function(){ // Funcion onclick para pasar los valores al formulario datos
		id = $(this).data("id");
		ruta = 'http://localhost/api/producto/mostrar/'+id; // url 
		console.log(ruta);
		$.get(ruta,function(result){ // se rellena el formulario con los datos optenidos del servidor
			$("#inputId").val(result.id);
			$("#inputNombre").val(result.nombre);
			$("#inputPrecio").val(result.precio);
			$("#inputStock").val(result.stock);
			$("#inputImagen").val(result.imagen);
			$("#inputEstado").val(result.estado);
			$("#inputCategoria").val(result.categoria_id);
			$(".modal-title").html("Editar Producto");
			$("#exampleModal").modal('show');
		},'json');
	});
	$('#exampleModal').on('hidden.bs.modal', function (e) { //oscar
		$(".modal-title").html("Nuevo Producto");
		$("#inputId").val("");
		$("#inputNombre").val("");
		$("#inputPrecio").val("");
		$("#inputStock").val("");
		$("#inputImagen").val("");
		$("#inputEstado").val("A");
		$("#inputCategoria").val("0");
	});
	$("#datos").on('click','.btnEliminar',function(){ // Esta es para eliminar un item 
		resp = confirm("Esta seguro de eliminar este registro?"); // mensaje de confrimacion 
		if(resp){ // si la respuesta es positiva
			//Obtenemos el valor del atributo data-id
			val_id = $(this).data("id");
			console.log("Eliminando "+val_id);
			$.ajax({
				url: 'http://localhost/api/producto/eliminar/'+val_id,
				type: 'delete', // tipo de peticion 
				success: function(){ // se caha la repuetsa 
					listarProductos(); // mensaje de confirmacion 
					$('.alert').css("display","block").alert();
				}
			});
		}
	});
});//Fin document.ready()
